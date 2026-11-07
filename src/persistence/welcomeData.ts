
import type { List, Backlog, Task } from "../taskAndListLogik";


export function createWelcomeData(): {
  lists: List[];
  backlog: Backlog;
} {

  const welcomeListId = crypto.randomUUID();

  const tasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: "Erstelle deine erste eigene Liste",
      description: "Probiere aus, wie du eine neue Liste erstellen kannst.",
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
      description: "Verschiebe diese Aufgabe in eine andere Liste und probiere aus, wie das funktioniert.",
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
      description: "Starte den Timer und lerne die Zeitmessung deiner App kennen.",
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

  return {
    lists: [welcomeList],
    backlog: backlog,
  };
}
