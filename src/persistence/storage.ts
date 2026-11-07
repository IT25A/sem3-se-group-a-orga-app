
import { openDB, type IDBPDatabase } from "idb";

import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";

interface AppDatabase {
  "app-state": {
    key: string;
    value: List[] | Backlog | boolean;
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
    tx.store.put(true, "hasInitialized"),
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
  hasInitialized: boolean | undefined;
}> {
  const db = await getDatabase();

  // Alle drei Einträge parallel aus der Datenbank laden.
  const [lists, backlog, hasInitialized] = await Promise.all([
    db.get("app-state", "lists"),
    db.get("app-state", "backlog"),
    db.get("app-state", "hasInitialized"),
  ]);

  return {
    lists: lists as List[] | undefined,
    backlog: backlog as Backlog | undefined,
    hasInitialized: hasInitialized as boolean | undefined,
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

// Nur den Initialisierungsmarker laden.
// Anders als loadBacklog() gibt diese Funktion einen Boolean zurück.
export async function loadInitialized(): Promise<boolean | undefined> {
  const db = await getDatabase();

  return db.get("app-state", "hasInitialized") as Promise<boolean | undefined>;
}

// --------------------------------
// DATEN LÖSCHEN
// --------------------------------

// Gesamten Speicher leeren
export async function clearStorage(): Promise<void> {
  const db = await getDatabase();

  await db.clear("app-state");
}

