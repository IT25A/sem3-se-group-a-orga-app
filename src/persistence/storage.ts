
import { openDB, type IDBPDatabase } from "idb";

import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";

interface AppDatabase {
  "app-state": {
    key: string;
    value: List[] | Backlog;
  };
}

const DB_NAME = "my-app-database";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AppDatabase>> | null = null;

// Datenbank öffnen
function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<AppDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("app-state")) {
          db.createObjectStore("app-state");
        }
      },
    });
  }
  return dbPromise;
}

// --------------------------------
// DATEN SPEICHERN
// --------------------------------

// Alle Daten speichern
export async function saveData(
  lists: List[],
  backlog: Backlog
): Promise<void> {
  const db = await getDatabase();

  const tx = db.transaction("app-state", "readwrite");

  await Promise.all([
    tx.store.put(lists, "lists"),
    tx.store.put(backlog, "backlog"),
  ]);

  await tx.done;
}

// Listen speichern
export async function saveLists(lists: List[]): Promise<void> {
  const db = await getDatabase();

  await db.put("app-state", lists, "lists");
}

// Backlog speichern
export async function saveBacklog(backlog: Backlog): Promise<void> {
  const db = await getDatabase();

  await db.put("app-state", backlog, "backlog");
}

// --------------------------------
// DATEN LADEN
// --------------------------------

// Alle Daten laden
export async function loadData(): Promise<{
  lists: List[] | undefined;
  backlog: Backlog | undefined;
}> {
  const db = await getDatabase();

  const [lists, backlog] = await Promise.all([
    db.get("app-state", "lists"),
    db.get("app-state", "backlog"),
  ]);

  return {
    lists: lists as List[] | undefined,
    backlog: backlog as Backlog | undefined,
  };
}

// Nur Listen laden
export async function loadLists(): Promise<List[] | undefined> {
  const db = await getDatabase();

  return db.get("app-state", "lists") as Promise<List[] | undefined>;
}

// Nur Backlog laden
export async function loadBacklog(): Promise<Backlog | undefined> {
  const db = await getDatabase();

  return db.get("app-state", "backlog") as Promise<Backlog | undefined>;
}

// --------------------------------
// DATEN LÖSCHEN
// --------------------------------

// Gesamten Speicher leeren
export async function clearStorage(): Promise<void> {
  const db = await getDatabase();

  await db.clear("app-state");
}
