import './style.css'
import './listStyle.css'

import Sortable from 'sortablejs'
import { lists, backlog, createTask, addTaskToList, editTaskCompleted, addList, removeTaskFromList, calculateProgress } from './taskAndListLogik'
import { showDialogNewTask, showDialogNewList } from './dialogs';
import { currentPage, renderHomePage } from './main';
import C from 'fullcalendar';

export function displayListPage():void{
  renderLists();
}

const sortableInstances: Sortable[] = [];

function destroySortables(): void {
  sortableInstances.forEach(sortable => sortable.destroy());
  sortableInstances.length = 0;
}

function initializeSortables(): void {
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

          if(oldListId != newListId){
            addTaskToList(taskId, newListId);
            removeTaskFromList(taskId, oldListId);
          }
          switch( currentPage){
                  case "home-page":
                    renderHomePage();
                    break;
                  case "list-page":
                    renderLists();
                    break;
                  default:
                    break;
                }
      }
    });

    sortableInstances.push(sortable);
  });
}

function renderLists(): void {
  const container = document.querySelector<HTMLDivElement>('#app',);
  if (!container) {
    throw new Error('Lists container not found');
  }

  destroySortables();
  container.replaceChildren();

  const newListItem = document.createElement('div');
  newListItem.id = "neue-liste-erstellen-feld";
  newListItem.textContent = "neue Liste";
  container.appendChild(newListItem);
  newListItem.addEventListener('click', () => {
      showDialogNewList(
          (title, description) => {
              addList(title, description)
              renderLists();
          }
      );
  });

  for (const list of lists) {
    renderListByIdInContainer(list.id, container, false)
  }

  initializeSortables();
}

//Funktion um Listen (woanders) anzuszeigen

export function renderListByIdInContainer(id: string, container: HTMLDivElement, clear: boolean):void{
  if(clear){
    container.replaceChildren();
    destroySortables();
  }
  const listIndex = lists.findIndex(l => l.id === id)
  const list = lists[listIndex]
  const listElement = document.createElement('section');
    listElement.className = 'list-card';

    const title = document.createElement('h2');
    title.textContent = list.title;

    const description = document.createElement('p');
    description.textContent = list.description;

    const taskCount = document.createElement('p');
    taskCount.textContent = `Tasks: ${list.tasks.length}`;

    const taskProgress = document.createElement('p');
    taskProgress.textContent = `Progress: ${calculateProgress(list.id)}%`;
    

    const taskList = document.createElement('ul');
    taskList.className = "sortable-list";
    taskList.id = list.id;

    for (const taskId of list.tasks) {
      const taskItem = document.createElement('li');
      taskItem.id = taskId;
      taskItem.classList.add('task-item');

      const task = backlog.tasks.find(t => t.id === taskId);
      
      if (task) {

          // Kopfbereich
          const taskHeader = document.createElement('div');
          taskHeader.className = 'task-header';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'task-checkbox';
          checkbox.checked = task.completed;
          checkbox.setAttribute('aria-label', `Aufgabe erledigt: ${task.title}`);

          const title = document.createElement('span');
          title.className = 'task-title';
          title.textContent = task.title;

          const toggle = document.createElement('button');
          toggle.textContent = '+';

          if (task.completed) {
              taskItem.classList.add('completed');
          }

          checkbox.addEventListener('change', () => {
              editTaskCompleted(task.id, checkbox.checked)
              taskItem.classList.toggle('completed', task.completed);
              switch( currentPage){
                  case "home-page":
                    renderHomePage();
                    break;
                  case "list-page":
                    renderLists();
                    break;
                  default:
                    break;
                }
          });

          // Detailbereich
          const details = document.createElement('div');
          details.className = 'task-details';
          details.hidden = true;

          const description = document.createElement('p');
          description.textContent = task.description;

          const priority = document.createElement('p');
          priority.textContent = `Priorität: ${task.priority}`;

          const complexity = document.createElement('p');
          complexity.textContent = `Komplexität: ${task.complexity}`;

          const timeEstimate = document.createElement('p');
          timeEstimate.textContent = `Zeitaufwand: ${task.timeEstimate}`;

          details.append(
            description,
            priority,
            complexity,
            timeEstimate
          );

          toggle.addEventListener('click', () => {
            details.hidden = !details.hidden;
            toggle.textContent = details.hidden ? '+' : '-';
          });

          taskHeader.append(checkbox, title, toggle);

          taskItem.append(taskHeader, details);
          taskList.appendChild(taskItem);
      }

    }

    const addTaskItem = document.createElement('li');
    addTaskItem.textContent = "+"
    addTaskItem.className = "add-task-item";
    taskList.appendChild(addTaskItem);

    addTaskItem.addEventListener('click', () => {
        showDialogNewTask(
            list.id,
            (listId, title, description, priority, complexity, timeEstimate, dueDate) => {
                const newTask = createTask({title, description, priority, complexity, timeEstimate, dueDate})
                addTaskToList(newTask.id, listId)
                switch( currentPage){
                  case "home-page":
                        renderHomePage();
                    break;
                  case "list-page":
                    renderLists();
                    break;
                  default:
                    break;
                }
            }
        );
    });

    listElement.append(title, description, taskCount,taskProgress, taskList);
    container.appendChild(listElement);
    if(clear){
      initializeSortables();
    }
}


