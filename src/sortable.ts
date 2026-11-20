import Sortable from 'sortablejs';
import {
  addTaskToList,
  removeTaskFromList,
  reorderTasksInList
} 
from './taskAndListLogik';import { currentPage } from './main';
import { refreshHomeList, displayListPage } from './displayEditingLists';


const sortableInstances: Sortable[] = [];

export function destroySortables(): void {
    sortableInstances.forEach(sortable => sortable.destroy());
    sortableInstances.length = 0;
}

export function initializeSortables(): void {
  document.querySelectorAll<HTMLElement>('.sortable-list').forEach(element => {
    const sortable = Sortable.create(element, {
      group: 'aufgaben',
      animation: 150,
      filter: '.add-task-item',
      preventOnFilter: false,
onEnd: async (event) => {
      const oldListId = event.from.id;
      const newListId = event.to.id;

      const item = event.item as HTMLElement;
      const taskId = item.id;

      // Bei einem Wechsel zwischen zwei Listen
      if (oldListId !== newListId) {
        await addTaskToList(taskId, newListId);
        await removeTaskFromList(taskId, oldListId);
      }

      // Neue Reihenfolge direkt aus dem DOM auslesen
      const getTaskOrder = (element: HTMLElement): string[] => {
        return Array.from(element.children)
          .filter(child => child.classList.contains('task-item'))
          .map(child => (child as HTMLElement).id);
      };

      // Reihenfolge der Zielliste speichern
      await reorderTasksInList(
        newListId,
        getTaskOrder(event.to as HTMLElement)
      );

      // Auch die Quellliste aktualisieren, falls gewechselt wurde
      if (oldListId !== newListId) {
        await reorderTasksInList(
          oldListId,
          getTaskOrder(event.from as HTMLElement)
        );
      }

      switch (currentPage) {
        case "home-page":
          refreshHomeList(oldListId, event.from as HTMLElement);

          if (newListId !== oldListId) {
            refreshHomeList(newListId, event.to as HTMLElement);
          }
          break;

        case "list-page":
          displayListPage();
          break;

        default:
          break;
      }
    }

    });

    sortableInstances.push(sortable);
  });
}