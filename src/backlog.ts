import {renderTaskByIdInContainer} from './displayEditingLists'
import {backlog} from './persistence/state'
import'./style.css'
import './styles/listStyle.css'

export function renderBacklogPage(): void {
  const app = document.getElementById('app') as HTMLDivElement;
  app.innerHTML = `
    <h1>Backlog</h1>
    <p>Hier sind alle deine Aufgaben, unabhängig von ihren Listenzugehörigkeiten.</p>
    <div id="backlog-container"></div>
  `;

  renderBacklogInContainer(app);
}

function renderBacklogInContainer(container: HTMLDivElement): void {
const backlogContainer = document.createElement('div');
  backlogContainer.id = 'backlog-container';
  backlogContainer.classList.add('list-card');
  container.appendChild(backlogContainer);

  

  const backlogList = document.createElement('ul');
  backlogList.id = 'backlog-list';
  backlogContainer.appendChild(backlogList);

  for (const task of backlog.tasks) {
    renderTaskByIdInContainer(task.id, 'backlog', backlogList);
  }

  container.append();
  
}