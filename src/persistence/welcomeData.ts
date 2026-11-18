
import type { List, Backlog, Task } from "../taskAndListLogik";
import type { Ziel } from "../displayZiele";


export function createWelcomeData(): {
  lists: List[];
  backlog: Backlog;
  ziellog: Ziel[];
} {

  const welcomeListId = crypto.randomUUID();

  const tasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: "Erstelle deine erste eigene Liste",
      description: "Gehe auf die Unterseite Listen. Hier kannst du mit einem Click auf das Plus oben eine neue Liste anlegen.",
      createdAt: new Date(),
      priority: "mittel",
      complexity: "einfach",
      timeEstimate: "kurz",
      completed: false,
      lists: ["backlog", welcomeListId],
    },
    {
      id: crypto.randomUUID(),
      title: "Verschiebe eine Aufgabe",
      description: "Verschiebe diese Aufgabe in deine neue Liste und probiere aus, was passiert.",
      createdAt: new Date(),
      priority: "mittel",
      complexity: "einfach",
      timeEstimate: "kurz",
      completed: false,
      lists: ["backlog", welcomeListId],
    },
    {
      id: crypto.randomUUID(),
      title: "Erledige eine Aufgabe",
      description: "Markiere diese Aufgabe als erledigt und beobachte, wie sich der Fortschritt verändert.",
      createdAt: new Date(),
      priority: "klein",
      complexity: "einfach",
      timeEstimate: "kurz",
      completed: false,
      lists: ["backlog", welcomeListId],
    },
    {
      id: crypto.randomUUID(),
      title: "Probiere den Timer aus",
      description: "Starte den Timer auf der entsprechenden Seite und lerne die Zeitmessung deiner App kennen.",
      createdAt: new Date(),
      priority: "mittel",
      complexity: "einfach",
      timeEstimate: "kurz",
      completed: false,
      lists: ["backlog", welcomeListId],
    },
    {
      id: crypto.randomUUID(),
      title: "Lass dir ein neues Zitat ausgeben wenn du zusätzliche Motivation brauchst!",
      description: "Probiere aus, wie du dir ein neues Zitat anzeigen lassen kannst",
      createdAt: new Date(),
      priority: "mittel",
      complexity: "einfach",
      timeEstimate: "kurz",
      completed: false,
      lists: ["backlog", welcomeListId],
    },
  ];

  const welcomeList: List = {
    id: welcomeListId,
    title: "Willkommen!",
    description: "Lerne die wichtigsten Funktionen deiner Aufgaben-App kennen.",
    createdAt: new Date(),
    tasks: tasks.map(task => task.id),
  };

  const backlog: Backlog = {
    id: "backlog",
    title: "Backlog",
    description: "This is the backlog list",
    createdAt: new Date(),
    tasks: tasks,
  };

  const welcomeZiel: Ziel = {
    id: 'welcomeZielId',
    title: "Willkommen!",
    description: "Lerne die wichtigsten Funktionen deiner Aufgaben-App kennen.",
    createdAt: new Date(),
    lists: [welcomeList.id],
    habits: [],
  };
  

  return {
    lists: [welcomeList],
    backlog: backlog,
    ziellog:[welcomeZiel]
  };
}
