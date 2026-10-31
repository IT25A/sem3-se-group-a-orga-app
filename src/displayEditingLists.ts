import './style.css'
import './listStyle.css'

import Sortable from 'sortablejs'
import { lists, backlog, createTask, addTaskToList, editTaskCompleted, addList } from './taskAndListLogik'
import { showDialogNewTask, showDialogNewList } from './dialogs';
import { currentPage, renderHomePage } from './main';

export function displayListPage():void{
  renderLists();
}

function renderLists(): void {

  const container = document.querySelector<HTMLDivElement>('#app',);

  if (!container) {
    throw new Error('Lists container not found');
  }
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
    const listElement = document.createElement('section');
    listElement.className = 'list-card';

    const title = document.createElement('h2');
    title.textContent = list.title;

    const description = document.createElement('p');
    description.textContent = list.description;

    const taskCount = document.createElement('p');
    taskCount.textContent = `Tasks: ${list.tasks.length}`;

    const taskList = document.createElement('ul');
    taskList.className = "sortable-list"

    for (const taskId of list.tasks) {
      const taskItem = document.createElement('li');

      const task = backlog.tasks.find(t => t.id === taskId);
      
      if (task) {

          taskItem.classList.add('task-item');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'task-checkbox';
          checkbox.checked = task.completed;
          checkbox.setAttribute('aria-label', `Aufgabe erledigt: ${task.title}`);

          const title = document.createElement('span');
          title.className = 'task-title';
          title.textContent = task.title;

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

          taskItem.append(checkbox, title);
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

    listElement.append(title, description, taskCount, taskList);
    container.appendChild(listElement);
  }

  document.querySelectorAll<HTMLElement>('.sortable-list').forEach((element) => {
    Sortable.create(element, {
      group: 'aufgaben',
      animation: 150,
      filter: '.add-task-item',
      preventOnFilter: false
    });
  });
}

//Funktion um Listen woanders anzuszeigen

export function renderListByIdInContainer(id: string, container: HTMLDivElement):void{
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

    const taskList = document.createElement('ul');
    taskList.className = "sortable-list"

    for (const taskId of list.tasks) {
      const taskItem = document.createElement('li');

      const task = backlog.tasks.find(t => t.id === taskId);
      
      if (task) {

          taskItem.classList.add('task-item');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'task-checkbox';
          checkbox.checked = task.completed;
          checkbox.setAttribute('aria-label', `Aufgabe erledigt: ${task.title}`);

          const title = document.createElement('span');
          title.className = 'task-title';
          title.textContent = task.title;

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

          taskItem.append(checkbox, title);
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

    listElement.append(title, description, taskCount, taskList);
    container.appendChild(listElement);

    document.querySelectorAll<HTMLElement>('.sortable-list').forEach((element) => {
      Sortable.create(element, {
        group: 'aufgaben',
        animation: 150,
        filter: '.add-task-item',
        preventOnFilter: false
      });
    });

}


