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
    <dialog id="aufgaben-popup">
      <p id="popup-text"></p>
      <form method="dialog">
          <button class="btnbenachrichtigung">OK</button>
      </form>
    </dialog>
  `;

  renderBacklogInContainer(app);
  benachrichtige();
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


/* hier Benachrichtigiungen zu offene Aufgaben in Backlog*/

function benachrichtige(): void {
  const offeneaufgaben = backlog.tasks.filter(
      task => task.completed === false
  );

  const anzahloffene = offeneaufgaben.length;

  if (anzahloffene >= 4) {
    pruefeanzahlgesamt();
  } else {
    pruefeoffeneAufgaben();
  }
}

function pruefeoffeneAufgaben(): void {
  const offeneaufgaben = backlog.tasks.filter(
      task => task.completed === false
  );

  const anzahloffene = offeneaufgaben.length;

  if (anzahloffene >= 1) {
    const popup = document.getElementById(
        'aufgaben-popup'
    ) as HTMLDialogElement | null;

    if (!popup) return;

    const popupText = popup.querySelector('#popup-text');

    if (!popupText) return;

    popupText.textContent =
        `Erinnerung 🔔 Du hast noch ${anzahloffene} offene Aufgaben.`;

    popup.showModal();

    const audio = new Audio("/Benachrichtigung.mp3");

    audio.play()
        .catch(error => console.error("Audiofehler:", error));
  }
}

function pruefeanzahlgesamt(): void {
  const anzahloffene = backlog.tasks.filter(
      task => task.completed === false
  ).length;

  if (anzahloffene >= 4) {
    const popup = document.getElementById(
        'aufgaben-popup'
    ) as HTMLDialogElement | null;

    if (!popup) return;

    const popupText = popup.querySelector('#popup-text');

    if (!popupText) return;

    popupText.textContent =
        `Achtung: Du hast insgesamt ${anzahloffene} offene Aufgaben. ` +
        `achte bitte auf deine Gesundheit! 🔔`;

    popup.showModal();

    const audio = new Audio("/Benachrichtigung.mp3");

    audio.play()
        .catch(error => console.error("Audiofehler:", error));
  }
}

