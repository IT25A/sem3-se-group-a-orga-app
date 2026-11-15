import Sortable from 'sortablejs';
import { addTaskToList, removeTaskFromList } from './taskAndListLogik';
import { currentPage } from './main';
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

      onEnd: (event) => {
        const oldListId = event.from.id;
        const newListId = event.to.id;
        const item = event.item as HTMLElement;
        const taskId = item.id;

        if (oldListId != newListId) {
          addTaskToList(taskId, newListId);
          removeTaskFromList(taskId, oldListId);
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