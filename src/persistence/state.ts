
import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";

import { createWelcomeData } from "./welcomeData";

import {
  loadData,
  saveLists,
  saveBacklog,
  saveData,
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

// --------------------------------
// INITIALISIERUNG
// --------------------------------

export async function initializeData(): Promise<void> {
  // Zuerst alle gespeicherten Daten aus der IndexedDB laden.
  const data = await loadData();

  // --------------------------------
  // FALL 1: Ersteinrichtung wurde bereits durchgeführt
  // --------------------------------

  if (data.hasInitialized === true) {
    lists = data.lists ?? [];

    backlog = data.backlog ?? {
      id: "backlog",
      title: "Backlog",
      description: "This is the backlog list",
      createdAt: new Date(),
      tasks: [],
    };

    if (data.lists === undefined || data.backlog === undefined) {
      await saveData(lists, backlog);
    }

    return;
  }

  // --------------------------------
  // FALL 2: Datenbank ist wirklich leer
  // --------------------------------

  const isFreshDatabase =
    data.lists === undefined &&
    data.backlog === undefined;

  if (isFreshDatabase) {
    const initialData = createWelcomeData();

    lists = initialData.lists;
    backlog = initialData.backlog;

    await saveData(lists, backlog);

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

  await saveData(lists, backlog);
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
// ALLE DATEN AKTUALISIEREN
// --------------------------------

export async function updateAppData(
  newLists: List[],
  newBacklog: Backlog
): Promise<void> {
  await saveData(newLists, newBacklog);

  lists = newLists;
  backlog = newBacklog;
}

// --------------------------------
// ALLE DATEN VALIDIEREN
// Inkonsistenzen zwischen Listen und Aufgaben prüfen
// --------------------------------

export function validateData(): void {
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
