
import { openDB, type IDBPDatabase } from "idb";

import type { List } from "../taskAndListLogik";
import type { Backlog } from "../taskAndListLogik";
import type { CalendarEvent } from "../calendar";
import type { Ziel } from "../displayZiele";
import type { Habit } from "./habitsState";
import type { HabitLog } from "./habitsState";

interface AppDatabase {
  "app-state": {
    key: string;
    value: List[] | Backlog | boolean | CalendarEvent[] | Habit[] | HabitLog[] | Ziel[];
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
  backlog: Backlog,
  eventlog:CalendarEvent[],
  ziellog:Ziel[],
): Promise<void> {
  const db = await getDatabase();

  const tx = db.transaction("app-state", "readwrite");

  await Promise.all([
    tx.store.put(lists, "lists"),
    tx.store.put(backlog, "backlog"),
    tx.store.put(true, "hasInitialized"),
    tx.store.put(eventlog, "eventlog"),
    tx.store.put(ziellog, "ziellog"),
  ]);
  await tx.done;
}
// Habits-Daten speichern
export async function saveHabitsData(
  habits: Habit[],
  habitLogs: HabitLog[]
): Promise<void> {
  const db = await getDatabase();

  const tx = db.transaction("app-state", "readwrite");

  await Promise.all([
    tx.store.put(habits, "habits"),
    tx.store.put(habitLogs, "habitLogs"),
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

// Ereignisse speichern
export async function saveEventlog(eventlog: CalendarEvent[]): Promise<void> {
  const db = await getDatabase();
  await db.put("app-state", eventlog, "eventlog");
}

export async function saveZiellog(ziellog: Ziel[]): Promise<void> {
  const db = await getDatabase();
  await db.put("app-state", ziellog, "ziellog");
}
// Habits speichern
export async function saveHabits(habits: Habit[]): Promise<void> {
  const db = await getDatabase();
  await db.put("app-state", habits, "habits");
}

// Habits-Logs speichern
export async function saveHabitLogs(habitLogs: HabitLog[]): Promise<void> {
  const db = await getDatabase();
  await db.put("app-state", habitLogs, "habitLogs");
}

// --------------------------------
// DATEN LADEN
// --------------------------------

// Alle Daten laden
export async function loadData(): Promise<{
  lists: List[] | undefined;
  backlog: Backlog | undefined;
  hasInitialized: boolean | undefined;
  eventlog: CalendarEvent[] | undefined;
  ziellog: Ziel[] |undefined;
}> {
  const db = await getDatabase();

  // Alle drei Einträge parallel aus der Datenbank laden.
  const [lists, backlog, hasInitialized, eventlog, ziellog] = await Promise.all([
    db.get("app-state", "lists"),
    db.get("app-state", "backlog"),
    db.get("app-state", "hasInitialized"),
    db.get("app-state", "eventlog"),
    db.get("app-state", "ziellog"),

  ]);

  return {
    lists: lists as List[] | undefined,
    backlog: backlog as Backlog | undefined,
    hasInitialized: hasInitialized as boolean | undefined,
    eventlog: eventlog as CalendarEvent[] | undefined,
    ziellog: ziellog as Ziel[] | undefined,
  };
}

//Habits und HabitLogs laden
export async function loadHabitsData(): Promise<{
  habits: Habit[] | undefined;
  habitLogs: HabitLog[] | undefined;
}> {
  const db = await getDatabase();

  const [habits, habitLogs] = await Promise.all([
    db.get("app-state", "habits"),
    db.get("app-state", "habitLogs"),
  ]);

  return {
    habits: habits as Habit[] | undefined,
    habitLogs: habitLogs as HabitLog[] | undefined,
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

// Nur Eventlog laden
export async function loadEventlog(): Promise<CalendarEvent[] | undefined> {
  const db = await getDatabase();

  return db.get("app-state", "eventlog") as Promise<CalendarEvent[] | undefined>;
}

// Nur Eventlog laden
export async function loadZiellog(): Promise<Ziel[] | undefined> {
  const db = await getDatabase();
  return db.get("app-state", "ziellog") as Promise<Ziel[] | undefined>;
}
// Nur Habits laden

export async function loadHabits(): Promise<Habit[] | undefined> {
  const db = await getDatabase();
  return db.get("app-state", "habits") as Promise<Habit[] | undefined>;
}

// Nur Habitlog laden
export async function loadHabitlog(): Promise<HabitLog[] | undefined> {
  const db = await getDatabase();
  return db.get("app-state", "habitLogs") as Promise<HabitLog[] | undefined>;
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

