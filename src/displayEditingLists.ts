import './style.css'
import './styles/listStyle.css'

import Sortable from 'sortablejs'
import { lists, backlog, createTask, deleteTask, addTaskToList, editTaskCompleted, addList, removeTaskFromList, calculateProgress, editTaskComplexity, editTaskDescription, editTaskDueDate, editTaskPriority, editTaskTimeEstimate, editTaskTitle } from './taskAndListLogik'
import { showDialogNewTask, showDialogNewList, showDialogDeleteTask, showDialogDeleteList, showDialogEditTask, showDialogEditList } from './dialogs';
import { currentPage } from './main';
import { renderBacklogPage } from './backlog';

export function displayListPage(): void {
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

        if (oldListId != newListId) {
          addTaskToList(taskId, newListId);
          removeTaskFromList(taskId, oldListId);
        }
        switch (currentPage) {
          case "home-page":
            renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
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

export function displayProgressBar( progress: number):  HTMLElement {
  

  //Progressbar
  //Hintergrund
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin: 6px 0;
  box-sizing: border-box;
`;

  //Balken 
  const fill = document.createElement('div');
  fill.style.cssText = `
  width: ${progress}%;
  height: 100%;
  background-color: #7952b3; 
  border-radius: 6px;
  transition: width 0.3s ease;
`;

  progressBar.appendChild(fill);

  return progressBar;
}


//Funktion um Aufgaben (woanders) anzuszeigen
export function renderTaskByIdInContainer(taskId: string, listId: string, container: HTMLUListElement): void {
  const thisTask = backlog.tasks.find(t => t.id === taskId);
  if (!thisTask) {
    throw new Error(`Task with id ${taskId} not found`);
  }
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

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '🗑️';
      deleteButton.className = 'delete-button';

      const editButton = document.createElement('button');
      editButton.textContent = '✏️';
      editButton.className = 'edit-button';

      const toggle = document.createElement('button');
      toggle.textContent = '⌄';
      toggle.className = 'toggle-button';

      if (task.completed) {
        taskItem.classList.add('completed');
      }

      deleteButton.addEventListener('click', () => {
        if(currentPage === "backlog-page"){
          deleteTask(task.id);
          renderBacklogPage();
        }else{
          showDialogDeleteTask(task.id, listId, () => {
          switch (currentPage) {
            case "home-page":
            renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
              break;
            case "list-page":
              renderLists();
              break;
            default:
              break;
          }
        })
        }  
      });

      editButton.addEventListener('click', () => {
        showDialogEditTask(task.id, (taskId, title, description, priority, complexity, timeEstimate, dueDate) => {
          editTaskTitle(taskId, title);
          editTaskDescription(taskId, description);
          editTaskPriority(taskId, priority);
          editTaskComplexity(taskId, complexity);
          editTaskTimeEstimate(taskId, timeEstimate);
          if (dueDate) {
            editTaskDueDate(taskId, dueDate);
          }
          switch (currentPage) {
            case "home-page":
              renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
              break;
            case "list-page":
              renderLists();
              break;
            case "backlog-page":
              renderBacklogPage();
              break;  
            default:
              break;
          }
        })
      });

      checkbox.addEventListener('change', () => {
        editTaskCompleted(task.id, checkbox.checked)
        taskItem.classList.toggle('completed', task.completed);
        switch (currentPage) {
          case "home-page":
            renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
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
        toggle.textContent = details.hidden ? '⌄' : '⌃';
      });

      taskHeader.append(checkbox, title, toggle, editButton, deleteButton);

      taskItem.append(taskHeader, details);
      if(currentPage === "home-page"){
        container.insertBefore(taskItem, container.querySelector('.zitat-card'));
      }else{
        container.appendChild(taskItem);
      }
    }
}

export function renderListByIdInContainer(id: string, container: HTMLDivElement, clear: boolean): void {
  if (clear) {
    for (const child of Array.from(container.children)) {
      if (child.classList.contains("list-card")) {
        child.replaceChildren()
        child.remove();
      }
    }
    destroySortables();
  }
  const listIndex = lists.findIndex(l => l.id === id)
  const list = lists[listIndex]
  const listElement = document.createElement('section');
  listElement.className = 'list-card';

  const listHeader = document.createElement('div');
  listHeader.className = 'list-header';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '🗑️';
  deleteButton.className = 'delete-button';

  const editButton = document.createElement('button');
  editButton.textContent = '✏️';
  editButton.className = 'edit-button';

  const title = document.createElement('h2');
  title.textContent = list.title;

  const description = document.createElement('p');
  description.textContent = list.description;

  const taskCount = document.createElement('p');
  taskCount.textContent = `Tasks: ${list.tasks.length}`;

  //Progressbar
  const taskProgress = document.createElement('p');
  taskProgress.textContent = `Progress: ${calculateProgress(list.id)}%`;

  const progressBar =displayProgressBar(calculateProgress(list.id));

  //Wrapper-Container 
  const progressContainer = document.createElement('div');
  progressContainer.append(progressBar);


  const taskList = document.createElement('ul');
  taskList.className = "sortable-list";
  taskList.id = list.id;

  for (const taskId of list.tasks) {
    renderTaskByIdInContainer(taskId, list.id, taskList);

  }

  const addTaskItem = document.createElement('li');
  addTaskItem.textContent = "+"
  addTaskItem.className = "add-task-item";
  taskList.appendChild(addTaskItem);

  addTaskItem.addEventListener('click', () => {
    showDialogNewTask(
      list.id,
      (listId, title, description, priority, complexity, timeEstimate, dueDate) => {
        const newTask = createTask({ title, description, priority, complexity, timeEstimate, dueDate })
        addTaskToList(newTask.id, listId)
        switch (currentPage) {
          case "home-page":
            renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
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

  deleteButton.addEventListener('click', () => {
    showDialogDeleteList(list.id, () => {
      switch (currentPage) {
        case "home-page":
          renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
          break;
        case "list-page":
          renderLists();
          break;
        default:
          break;
      }
    })
  });

  editButton.addEventListener('click', () => {
    showDialogEditList(list.id, (listId, title, description) => {
      const listIndex = lists.findIndex(l => l.id === listId)
      lists[listIndex].title = title;
      lists[listIndex].description = description;

      switch (currentPage) {
        case "home-page":
          renderListByIdInContainer(lists[0].id, document.querySelector<HTMLDivElement>('#app')!, true);
          break;
        case "list-page":
          renderLists();
          break;
        default:
          break;
      }
    })
  });

  listHeader.append(title, editButton, deleteButton);
  listElement.append(listHeader, description, taskCount, taskProgress, progressBar, taskList);

  if(currentPage === "home-page"){
    container.insertBefore(listElement, container.querySelector('.zitat-card'));
  }else{
    container.appendChild(listElement);
  }

  if (clear) {
    initializeSortables();
  }
}


