
import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";
import type { CalendarEvent } from "../calendar";
import type { Ziel } from "../displayZiele";
import { initializeHabitsData } from "./habitsState";

import { createWelcomeData } from "./welcomeData";

import {
  loadData,
  saveLists,
  saveBacklog,
  saveData,
  saveEventlog,
  loadEventlog,
  saveZiellog,
  loadZiellog,
} from "./storage";

// --------------------------------
// GLOBALER STATE
// --------------------------------

export let lists: List[] = [];

export let backlog: Backlog = {
  id: "backlog",
  title: "Backlog",
  description: "This is the backlog list",
  createdAt: new Date(),
  tasks: [],
};

export let ziellog: Ziel[];

export let eventlog: CalendarEvent[] = [];

// --------------------------------
// INITIALISIERUNG
// --------------------------------

export async function initializeData(): Promise<void> {
  // Zuerst alle gespeicherten Daten aus der IndexedDB laden.
  const data = await loadData();
  await initializeHabitsData();

  // --------------------------------
  // FALL 1: Ersteinrichtung wurde bereits durchgeführt
  // --------------------------------

  if (data.hasInitialized === true) {
    lists = data.lists ?? [];
    eventlog = data.eventlog ?? [];

    backlog = data.backlog ?? {
      id: "backlog",
      title: "Backlog",
      description: "This is the backlog list",
      createdAt: new Date(),
      tasks: [],
    };
    ziellog = data.ziellog ?? [];

    if (data.lists === undefined || data.backlog === undefined) {
      await saveData(lists, backlog, eventlog, ziellog);
    }

    return;
  }

  // --------------------------------
  // FALL 2: Datenbank ist wirklich leer
  // --------------------------------

  const isFreshDatabase =
    data.lists === undefined &&
    data.backlog === undefined &&
    data.ziellog === undefined;

  if (isFreshDatabase) {
    const initialData = createWelcomeData();

    lists = initialData.lists;
    backlog = initialData.backlog;
    ziellog = initialData.ziellog;

    await saveData(lists, backlog, eventlog, ziellog);
    

    return;
  }

  // --------------------------------
  // FALL 3: Es existieren bereits ältere Daten,
  // aber noch kein Initialisierungsmarker.
  // --------------------------------

  lists = data.lists ?? [];

  backlog = data.backlog ?? {
    id: "backlog",
    title: "Backlog",
    description: "This is the backlog list",
    createdAt: new Date(),
    tasks: [],
  };

  await saveData(lists, backlog, eventlog, ziellog);
}

// --------------------------------
// LISTEN AKTUALISIEREN
// --------------------------------

export async function updateLists(
  newLists: List[]
): Promise<void> {
  lists = newLists;

  await saveLists(lists);
}

// --------------------------------
// BACKLOG AKTUALISIEREN
// --------------------------------

export async function updateBacklog(
  newBacklog: Backlog
): Promise<void> {
  backlog = newBacklog;

  await saveBacklog(backlog);
}

// --------------------------------
// Eventlog AKTUALISIEREN
// --------------------------------

export async function updateEventlog(
  newEventlog: CalendarEvent[]
): Promise<void> {
  eventlog = newEventlog;

  await saveEventlog(eventlog);
}
// --------------------------------
// Ziellog AKTUALISIEREN
// --------------------------------

export async function updateZiellog(
  newZiellog: Ziel[]
): Promise<void> {
  ziellog = newZiellog;
  await saveZiellog(ziellog);
}

// --------------------------------
// Eventlog LADEN
// --------------------------------

export async function getEventlog(): Promise<CalendarEvent[] | undefined> {
  return await loadEventlog()
}

// --------------------------------
// Ziellog LADEN
// --------------------------------

export async function getZiellog(): Promise<Ziel[]|undefined> {
  return await loadZiellog()
}


// --------------------------------
// ALLE DATEN AKTUALISIEREN
// --------------------------------

export async function updateAppData(
  newLists: List[],
  newBacklog: Backlog,
  newEventlog: CalendarEvent[],
  newZiellog: Ziel[],
): Promise<void> {
  await saveData(newLists, newBacklog, newEventlog, newZiellog);

  lists = newLists;
  backlog = newBacklog;
  eventlog = newEventlog;
  ziellog = newZiellog;
}

// --------------------------------
// KALENDER EVENTS ERZEUGEN
// --------------------------------


export function getCalendarEvents() {
  return backlog.tasks
    .filter(task => !task.completed)
    .flatMap(task => {
      const events = [];

      // Geplanter Zeitraum
      if (task.startDate && task.endDate) {
        events.push({
          id: `task-${task.id}-schedule`,
          title: task.title,
          start: task.startDate,
          end: task.endDate,
          allDay: false,
          editable: false,
          extendedProps: {
            taskId: task.id,
            type: "task-schedule"
          }
        });
      }

      // Fälligkeitsdatum
      if (task.dueDate instanceof Date &&
        !Number.isNaN(task.dueDate.getTime())) {
        events.push({
          id: `task-${task.id}-deadline`,
          title: task.title,
          start: [
            task.dueDate.getFullYear(),
            String(task.dueDate.getMonth() + 1).padStart(2, "0"),
            String(task.dueDate.getDate()).padStart(2, "0")
          ].join("-"),
          allDay: true,
          editable: false,
          color: "#dc2626",
          extendedProps: {
            taskId: task.id,
            type: "task-reminder"
          }
        });
      }

      return events;
    });
}

// --------------------------------
// ALLE DATEN VALIDIEREN
// Inkonsistenzen zwischen Listen und Aufgaben prüfen
// --------------------------------

export function validateData(): void {
  for (const list of lists) {
      list.tasks = list.tasks.filter(taskId =>
          backlog.tasks.some(task => task.id === taskId)
      );
  }
  for (const list of lists) {
    for (const taskId of list.tasks) {
      const task = backlog.tasks.find(task => task.id === taskId);

      if (!task) {
        console.warn(
          `Inkonsistenz: Liste "${list.title}" enthält Task-ID "${taskId}", die nicht im Backlog existiert.`
        );
      } else if (!task.lists.includes(list.id)) {
        console.warn(
          `Inkonsistenz: Task "${task.title}" kennt Liste "${list.title}" nicht.`
        );
      }
    }
  }

  for (const task of backlog.tasks) {
    for (const listId of task.lists) {
      if (listId === backlog.id) continue;

      const list = lists.find(list => list.id === listId);

      if (!list) {
        console.warn(
          `Inkonsistenz: Task "${task.title}" verweist auf eine nicht existierende Liste "${listId}".`
        );
      } else if (!list.tasks.includes(task.id)) {
        console.warn(
          `Inkonsistenz: Task "${task.title}" fehlt in Liste "${list.title}".`
        );
      }
    }
  }
  
}
