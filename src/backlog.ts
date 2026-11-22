import {renderTaskByIdInContainer} from './displayEditingLists'
import {backlog, updateBacklog} from './persistence/state'
import'./style.css'
import './styles/listStyle.css'
import { initializeSortables} from './sortable'
import type { Complexity, Priority, TimeEstimate, Task } from './taskAndListLogik'


/**********************
 * Sortieren
 **********************/
type SortierKriterium =
  | 'completed'
  | 'dueDate'
  | 'complexity'
  | 'priority'
  | 'timeEstimate';

let aktuellesKriterium: SortierKriterium | null = null;
let sortierRichtung: 'asc' | 'desc' = 'asc';
let urspruenglicheBacklogReihenfolge: string[] | null = null;

function sortiereBacklog(): void {

  if (!aktuellesKriterium) return;

  // Ursprüngliche Reihenfolge nur einmal sichern
  if (urspruenglicheBacklogReihenfolge === null) {
    urspruenglicheBacklogReihenfolge =
      backlog.tasks.map(task => task.id);
  }

  // Tatsächliches Backlog sortieren
  backlog.tasks.sort((a, b) => {

    let wertA: number;
    let wertB: number;

    switch (aktuellesKriterium) {

      case 'completed':
        wertA = a.completed ? 1 : 0;
        wertB = b.completed ? 1 : 0;
        break;

      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        wertA = new Date(a.dueDate).getTime();
        wertB = new Date(b.dueDate).getTime();
        break;

      case 'priority':
        wertA = ['klein', 'mittel', 'hoch'].indexOf(a.priority);
        wertB = ['klein', 'mittel', 'hoch'].indexOf(b.priority);
        break;

      case 'complexity':
        wertA = ['einfach', 'mittel', 'schwierig'].indexOf(a.complexity);
        wertB = ['einfach', 'mittel', 'schwierig'].indexOf(b.complexity);
        break;

      case 'timeEstimate':
        wertA = ['kurz', 'mittel', 'lang'].indexOf(a.timeEstimate);
        wertB = ['kurz', 'mittel', 'lang'].indexOf(b.timeEstimate);
        break;

      default:
        return 0;
    }

    const vergleich = wertA - wertB;

    return sortierRichtung === 'asc'
      ? vergleich
      : -vergleich;
  });

  // Neue Reihenfolge anzeigen
  aktualisiereBacklogAnzeige();
  updateBacklog(backlog);

}


export function aktualisiereBacklogAnzeige(): void {
  const backlogList = document.getElementById(
    'backlog-list'
  ) as HTMLUListElement | null;

  if (!backlogList) return;

  backlogList.replaceChildren();

  const gefilterteAufgaben = filterBacklogTasks();

  for (const task of gefilterteAufgaben) {
    renderTaskByIdInContainer(
      task.id,
      'backlog',
      backlogList
    );
  }
}

function setzeBacklogZurueck(): void {

  if (!urspruenglicheBacklogReihenfolge) return;

  const aufgabenMap = new Map(
    backlog.tasks.map(task => [task.id, task])
  );

  // Ursprüngliche Reihenfolge wiederherstellen
  const wiederhergestellteAufgaben =
    urspruenglicheBacklogReihenfolge
      .map(id => aufgabenMap.get(id))
      .filter((task): task is typeof backlog.tasks[number] =>
        task !== undefined
      );

  // Neu hinzugefügte Aufgaben ebenfalls behalten
  const urspruenglicheIds = new Set(
    urspruenglicheBacklogReihenfolge
  );

  const neueAufgaben = backlog.tasks.filter(
    task => !urspruenglicheIds.has(task.id)
  );

  backlog.tasks = [
    ...wiederhergestellteAufgaben,
    ...neueAufgaben
  ];

  aktuellesKriterium = null;
  sortierRichtung = 'asc';

  urspruenglicheBacklogReihenfolge = null;

  aktualisiereBacklogAnzeige();

  updateBacklog(backlog);
}


export function initialisiereSortierung(): void {

  const kriterium = document.getElementById(
    'sortier-kriterium'
  ) as HTMLSelectElement | null;

  const richtung = document.getElementById(
    'sortier-richtung'
  ) as HTMLSelectElement | null;

  const reset = document.getElementById(
    'sortierung-reset'
  ) as HTMLButtonElement | null;

  if (!kriterium || !richtung || !reset) return;

  kriterium.addEventListener('change', () => {

    aktuellesKriterium =
      kriterium.value as SortierKriterium;

    sortiereBacklog();

  });

  richtung.addEventListener('change', () => {

    sortierRichtung =
      richtung.value as 'asc' | 'desc';

    sortiereBacklog();

  });
  reset.addEventListener('click', () => {

    setzeBacklogZurueck();

    kriterium.value = '';
    richtung.value = 'asc';

  });
}
/**********************
 * Filtern
 **********************/

type BacklogFilter = {
  completed: 'alle' | 'offen' | 'erledigt';
  priority: 'alle' | Priority;
  complexity: 'alle' | Complexity;
  timeEstimate: 'alle' | TimeEstimate;
};

let backlogFilter: BacklogFilter = {
  completed: 'alle',
  priority: 'alle',
  complexity: 'alle',
  timeEstimate: 'alle'
};

function filterBacklogTasks(): Task[] {
  return backlog.tasks.filter(task => {
    const matchesCompleted =
      backlogFilter.completed === 'alle' ||
      (backlogFilter.completed === 'offen' && !task.completed) ||
      (backlogFilter.completed === 'erledigt' && task.completed);

    const matchesPriority =
      backlogFilter.priority === 'alle' ||
      task.priority === backlogFilter.priority;

    const matchesComplexity =
      backlogFilter.complexity === 'alle' ||
      task.complexity === backlogFilter.complexity;

    const matchesTimeEstimate =
      backlogFilter.timeEstimate === 'alle' ||
      task.timeEstimate === backlogFilter.timeEstimate;

    return (
      matchesCompleted &&
      matchesPriority &&
      matchesComplexity &&
      matchesTimeEstimate
    );
  });
}

function createBacklogFilterBar(): HTMLDivElement {
  const filterBar = document.createElement('div');
  filterBar.className = 'backlog-filter-bar';

  const filterButton = document.createElement('button');
  filterButton.className = 'backlog-filter-button';
  filterButton.innerHTML = `
    <span>☷</span>
    <span>Filtern</span>
    <span>⌄</span>
  `;

  const filterPanel = document.createElement('div');
  filterPanel.className = 'backlog-filter-panel';
  filterPanel.hidden = true;

  const filterOptions = [
    {
      key: 'completed',
      label: 'Status',
      options: ['alle', 'offen', 'erledigt']
    },
    {
      key: 'priority',
      label: 'Priorität',
      options: ['alle', 'klein', 'mittel', 'hoch']
    },
    {
      key: 'complexity',
      label: 'Komplexität',
      options: ['alle', 'einfach', 'mittel', 'schwierig']
    },
    {
      key: 'timeEstimate',
      label: 'Zeitaufwand',
      options: ['alle', 'kurz', 'mittel', 'lang']
    }
  ] as const;

  for (const filter of filterOptions) {
    const group = document.createElement('label');
    group.className = 'backlog-filter-group';

    const label = document.createElement('span');
    label.textContent = filter.label;

    const select = document.createElement('select');
    select.dataset.filter = filter.key;

    for (const option of filter.options) {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent =
        option === 'alle' ? 'Alle' :
        option.charAt(0).toUpperCase() + option.slice(1);

      select.appendChild(optionElement);
    }
    

    select.value = backlogFilter[filter.key];

    select.addEventListener('change', () => {
      backlogFilter[filter.key] = select.value as never;
      aktualisiereBacklogAnzeige();
    });

    group.append(label, select);
    filterPanel.appendChild(group);
  }

  filterButton.addEventListener('click', () => {
    filterPanel.hidden = !filterPanel.hidden;
    filterButton.classList.toggle('active', !filterPanel.hidden);
  });

  filterBar.append(filterButton, filterPanel);

  return filterBar;
}

/**********************
 * Anzeigen
 **********************/

export function renderBacklogPage(): void {
  const app = document.getElementById('app') as HTMLDivElement;
  app.innerHTML = `
  <div class='list-page-heading'>
    <h1>Backlog</h1>
    <p>Deine Aufgaben, dein kleines Chaos! <br> Hier sind alle deine Aufgaben, unabhängig von ihren Listenzugehörigkeiten aufgeführt.</p>
    </div>
      <div id="sortierleiste" class="sortierleiste">

    <div class="sortier-header">
      <div>
        <h2>Aufgaben organisieren</h2>
        <p>Finde genau die Aufgabe, die du suchst.</p>
      </div>
      <button id="sortierung-reset" class="sortier-icon">↺</button>
    </div>

    <label for="sortier-kriterium">Sortieren nach</label>

    <select id="sortier-kriterium">
      <option value="">Keine Sortierung</option>
      <option value="completed">Erledigungsstatus</option>
      <option value="dueDate">Fälligkeitsdatum</option>
      <option value="complexity">Komplexität</option>
      <option value="priority">Priorität</option>
      <option value="timeEstimate">Zeitaufwand</option>
    </select>

    <div class="sortier-footer">

      <select id="sortier-richtung">
        <option value="asc">Aufsteigend ↑</option>
        <option value="desc">Absteigend ↓</option>
      </select>

      

    </div>
  </div>

  <div id="backlog-container"></div>
     <dialog id="aufgaben-popup">
      <p id="popup-text"></p>
      <form method="dialog">
          <button class="btnbenachrichtigung">OK</button>
      </form>
    </dialog>
  `;
  renderBacklogInContainer(app);
  initialisiereSortierung();
}


export function renderBacklogInContainer(
  container: HTMLDivElement,
  enableSortable = false
): void {
  const backlogContainer =
    container.id === 'backlog-container'
      ? container
      : container.querySelector<HTMLDivElement>('#backlog-container');

  if (!backlogContainer) return;

  backlogContainer.classList.add('list-card');
  backlogContainer.replaceChildren();
  

  const backlogList = document.createElement('ul');
  backlogList.id = 'backlog-list';
  backlogList.classList.add('sortable-list');

  backlogContainer.appendChild(createBacklogFilterBar());
  backlogContainer.appendChild(backlogList);

  for (const task of filterBacklogTasks()) {
  renderTaskByIdInContainer(task.id, 'backlog', backlogList);
}

  // Sortable nur initialisieren, wenn es ausdrücklich gewünscht ist
  if (enableSortable) {
    initializeSortables();
  }
}



 /**********************
 * Benachrichtigungen
 **********************/

  export function benachrichtige(): void {
    if (benachrichtigungenStumm ) return;

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

  export function pruefeoffeneAufgaben(): void {
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
      if (!benachrichtigungenOhneTon ) {
        //!benachrichtigungenOhneTon bedeutet: Nur wenn „ohne Ton“ nicht aktiviert ist, spiele Musik ab
      const audio = new Audio("/Benachrichtigung.mp3");

      audio.play()
          .catch(error => console.error("Audiofehler:", error));
    }}
  }

  export function pruefeanzahlgesamt(): void {
    const anzahloffene = backlog.tasks.filter(
        task => task.completed === false
    ).length;

    if (anzahloffene >= 10) {
      const popup = document.getElementById(
          'aufgaben-popup'
      ) as HTMLDialogElement | null;

      if (!popup) return;

      const popupText = popup.querySelector('#popup-text');

      if (!popupText) return;

      popupText.textContent =
          `Achtung: Du hast insgesamt ${anzahloffene} offene Aufgaben. ` +
          `Achte bitte auf deine Gesundheit! 🔔`;

      popup.showModal();
      if (!benachrichtigungenOhneTon ) {

      const audio = new Audio("/error1.mp3");

      audio.play()
          .catch(error => console.error("Audiofehler:", error));
    }}
  }
let benachrichtigungenStumm = false;

export function stummschalten(): void {
  const checkbox = document.getElementById(
      "benachrichtigung-stumm"
  ) as HTMLInputElement | null;

  if (!checkbox) return;

  checkbox.checked = benachrichtigungenStumm;

  checkbox.addEventListener("change", () => {
    benachrichtigungenStumm = checkbox.checked;
  });
}
let benachrichtigungenOhneTon = false;

export function benachrichtigeOhneTon(): void {
  const checkbox = document.getElementById(
      "benachrichtigung-ohneTon"
  ) as HTMLInputElement | null;

  if (!checkbox) return;

  checkbox.checked = benachrichtigungenOhneTon;

  checkbox.addEventListener("change", () => {
    benachrichtigungenOhneTon = checkbox.checked;
  });
}


