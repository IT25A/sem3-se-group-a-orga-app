
import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";
import {populateTestData} from "../charlysTests/TestFictures";

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
  const data = await loadData();

  // Gespeicherte Listen laden
  if (data.lists !== undefined) {
    lists = data.lists;
  }

  // Gespeichertes Backlog laden
  if (data.backlog !== undefined) {
    backlog = data.backlog;
  }

  // Initialdaten speichern, falls noch nicht vorhanden
  if (data.lists === undefined) {
    await saveLists(lists);
  }

  if (data.backlog === undefined) {
    await saveBacklog(backlog);
  }
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
// ALLE DATEN VALIDIEREN (Inkonsistenzen prüfen)
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

// --------------------------------
// APP RESET (wenn nötig, um die App in einen sauberen Zustand zu versetzen)
// --------------------------------


export async function resetAppData(): Promise<void> {
  const emptyLists: List[] = [];

  const emptyBacklog: Backlog = {
    id: "backlog",
    title: "Backlog",
    description: "This is the backlog list",
    createdAt: new Date(),
    tasks: [],
  };
  populateTestData();

  await updateAppData(emptyLists, emptyBacklog);
}