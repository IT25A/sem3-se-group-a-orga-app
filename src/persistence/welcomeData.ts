import type { List, Backlog, Task } from "../taskAndListLogik";
import type { Ziel } from "../displayZiele";

export function createWelcomeData(): {
  lists: List[];
  backlog: Backlog;
  ziellog: Ziel[];
} {
  const now = new Date();

  const listIds = {
    listen: crypto.randomUUID(),
    ziele: crypto.randomUUID(),
    habits: crypto.randomUUID(),
    zeit: crypto.randomUUID(),
    home: crypto.randomUUID(),
  };

  const welcomeZielId = "welcomeZielId";

  const createTask = (
    title: string,
    description: string,
    listId: string
  ): Task => ({
    id: crypto.randomUUID(),
    title,
    description,
    createdAt: now,
    priority: "mittel",
    complexity: "einfach",
    timeEstimate: "kurz",
    completed: false,
    lists: ["backlog", listId],
  });

  // Listen und Backlog
  const listenTasks: Task[] = [
    createTask(
      "Erstelle deine erste eigene Liste",
      "Wechsle zum Reiter „Listen“. Klicke dort auf „Neue Liste“, um eine eigene Liste anzulegen. Gib ihr einen passenden Namen und speichere sie. So kannst du deine Aufgaben später nach Themen oder Projekten sortieren.",
      listIds.listen
    ),
    createTask(
      "Bearbeite eine Liste",
      "Suche deine gerade erstellte Liste. Klicke auf das Stift-Symbol, um sie zu bearbeiten. Ändere beispielsweise ihren Namen oder ihre Beschreibung und speichere deine Änderungen.",
      listIds.listen
    ),
    createTask(
      "Erstelle deine erste eigene Aufgabe",
      "Öffne eine deiner Listen und klicke auf das Plus-Symbol (+). Dadurch kannst du eine neue Aufgabe erstellen. Gib ihr einen aussagekräftigen Titel und eine Beschreibung, damit du später genau weißt, was zu erledigen ist.",
      listIds.listen
    ),
    createTask(
      "Bearbeite eine Aufgabe",
      "Suche eine Aufgabe und klicke auf das Stift-Symbol. Jetzt kannst du beispielsweise den Titel, die Priorität oder die Beschreibung ändern. Speichere deine Änderungen und schau dir anschließend das Ergebnis an.",
      listIds.listen
    ),
    createTask(
      "Sortiere deine Aufgaben per Drag & Drop",
      "Öffne eine Liste mit mehreren Aufgaben. Klicke auf ein Listenelement und halte die Maustaste gedrückt. Ziehe es anschließend an eine andere Position und lasse die Maustaste los. So kannst du die Reihenfolge deiner Aufgaben ganz einfach selbst bestimmen.",
      listIds.listen
    ),
    createTask(
      "Verschiebe eine Aufgabe in eine andere Liste",
      "Wähle eine Aufgabe aus und verschiebe sie in eine andere Liste. Probiere aus, wie du deine Aufgaben zwischen verschiedenen Listen organisieren kannst. So kannst du beispielsweise Aufgaben passend zu deinen Projekten oder Themen gruppieren.",
      listIds.listen
    ),
    createTask(
      "Lösche eine Testaufgabe",
      "Erstelle zunächst eine zusätzliche Aufgabe, die du nicht mehr benötigst. Klicke anschließend auf das Papierkorb-Symbol dieser Aufgabe, um sie zu löschen. So lernst du, wie du überflüssige Aufgaben aus deiner OrgaApp entfernen kannst.",
      listIds.listen
    ),
    createTask(
      "Lösche eine Testliste",
      "Erstelle eine zusätzliche Liste, die du nicht mehr benötigst. Klicke anschließend auf das Papierkorb-Symbol der Liste, um sie zu löschen. Probiere die Funktion am besten mit einer leeren Testliste aus, damit du keine wichtigen Aufgaben verlierst.",
      listIds.listen
    ),
    createTask(
      "Sortiere deine Aufgaben im Backlog",
      "Wechsle zum Reiter „Backlog“. Hier findest du alle deine Aufgaben unabhängig davon, welchen Listen sie zugeordnet sind. Probiere die Sortierfunktion aus und sortiere deine Aufgaben beispielsweise nach Zeitschätzung. So kannst du schnell Aufgaben finden, die nur wenig Zeit in Anspruch nehmen, wenn du gerade nicht viel Zeit zur Verfügung hast.",
      listIds.listen
    ),
    createTask(
      "Filtere deine Aufgaben im Backlog",
      "Bleibe im Reiter „Backlog“ und probiere die Filterfunktion aus. Filtere deine Aufgaben beispielsweise nach Priorität, um nur besonders wichtige Aufgaben anzuzeigen. Du kannst so die angezeigten Aufgaben gezielt eingrenzen und dich auf das konzentrieren, was gerade für dich relevant ist.",
      listIds.listen
    ),
  ];

  // Ziele und Planung
  const zieleTasks: Task[] = [
    createTask(
      "Erstelle dein erstes Ziel",
      "Wechsle zum Reiter „Ziele“ und erstelle ein neues Ziel. Klicke anschließend auf dein Ziel, um es zu öffnen. Über das Stift-Symbol kannst du eine Beschreibung hinzufügen. Nutze diese Möglichkeit, um festzuhalten, warum du dieses Ziel erreichen möchtest und was dich dabei motiviert.",
      listIds.ziele
    ),
    createTask(
      "Verbinde Listen und Habits mit deinem Ziel",
      "Öffne dein gerade erstelltes Ziel. Über das Stift-Symbol kannst du Listen und Gewohnheiten (Habits) mit deinem Ziel verknüpfen. Probiere aus, eine deiner Listen und eine deiner Gewohnheiten hinzuzufügen. Für verknüpfte Habits kannst du außerdem einen Zielscore festlegen. Damit bestimmst du, welchen Fortschritt du bei einer Gewohnheit erreichen möchtest, um deinem Ziel näherzukommen.",
      listIds.ziele
    ),
    createTask(
      "Markiere ein Ziel als erreicht",
      "Öffne dein Ziel und suche den Button, mit dem du es als erreicht markieren kannst. Probiere die Funktion aus, um kennenzulernen, wie du abgeschlossene Ziele festhältst. So kannst du deine Erfolge dokumentieren und sehen, was du bereits erreicht hast.",
      listIds.ziele
    ),
    createTask(
      "Plane eine Aufgabe im Kalender",
      "Wechsle zum Reiter „Planung“. Links findest du dein Backlog mit allen Aufgaben, rechts den Kalender. Ziehe eine Aufgabe aus dem Backlog per Drag & Drop in den Kalender, um einen Zeitraum für ihre Umsetzung zu blocken. So kannst du festlegen, wann du dich um eine bestimmte Aufgabe kümmern möchtest.",
      listIds.ziele
    ),
    createTask(
      "Bearbeite deine Kalendereinträge",
      "Probiere aus, wie du deine geplanten Aufgaben im Kalender anpassen kannst: Bewege einen Eintrag per Drag & Drop, um ihn auf einen anderen Zeitpunkt zu verschieben. Ziehe an seinen Rändern, um den geblockten Zeitraum zu vergrößern oder zu verkleinern. Wenn du mit der Maus über einen Eintrag fährst (Hover), werden dir weitere Details angezeigt. Mit einem Klick auf einen Eintrag kannst du ihn löschen.",
      listIds.ziele
    ),
    createTask(
      "Erstelle einen eigenen Kalendereintrag",
      "Klicke auf eine freie Stelle im Kalender. Dadurch kannst du einen neuen Termin erstellen, der unabhängig von deinen Aufgaben ist. Nutze diese Funktion beispielsweise, um Meetings, Verabredungen oder andere feste Termine einzutragen. Probiere außerdem die Zoom-Funktion des Kalenders aus, um die Zeitansicht zu vergrößern oder zu verkleinern.",
      listIds.ziele
    ),
  ];

  // Habits
  const habitsTasks: Task[] = [
    createTask(
      "Erstelle deine erste Gewohnheit",
      "Wechsle zum Reiter „Habits“ und lege eine neue Gewohnheit an. Überlege dir, welche Gewohnheit du regelmäßig verfolgen möchtest, beispielsweise Sport treiben, Lesen oder ausreichend Wasser trinken. Nach dem Erstellen kannst du deine Gewohnheit tracken. Deine Fortschritte werden außerdem im Kalender visualisiert, sodass du deine Entwicklung im Zeitverlauf beobachten kannst.",
      listIds.habits
    ),
    createTask(
      "Tracke den Fortschritt deiner Gewohnheit",
      "Öffne den Reiter „Habits“ und suche deine gerade erstellte Gewohnheit. Probiere aus, ihren Zähler zu erhöhen und wieder zu verringern. So kannst du festhalten, wie oft du eine Gewohnheit ausgeführt hast, und deinen Fortschritt flexibel anpassen. Schau anschließend im Kalender auf der Habitseite nach, wie sich deine Einträge dort widerspiegeln.",
      listIds.habits
    ),
  ];

  // Zeit und Timer
  const zeitTasks: Task[] = [
    createTask(
      "Erstelle deinen persönlichen Wecker",
      "Wechsle zur Timer-Seite und probiere die Funktion zum Erstellen personalisierter Wecker aus. Lege einen eigenen Wecker an und stelle die gewünschte Uhrzeit ein. So kannst du dich von deiner OrgaApp an wichtige Termine, Pausen oder andere Dinge erinnern lassen.",
      listIds.zeit
    ),
    createTask(
      "Probiere die verschiedenen Timer aus",
      "Auf der Timer-Seite kannst du Timer mit einer Dauer von 5, 30 oder 60 Minuten starten. Probiere mindestens einen davon aus und entdecke, wie du damit Arbeitsphasen, Pausen oder kurze Aufgaben zeitlich begrenzen kannst.",
      listIds.zeit
    ),
    createTask(
      "Erstelle einen Aufgabenwecker",
      "Probiere auf der Timer-Seite die Funktion für Aufgabenwecker aus. Erstelle einen Wecker für eine bestimmte Aufgabe, damit du rechtzeitig daran erinnert wirst, diese Aufgabe zu erledigen. So kannst du deine Erinnerungen direkt mit deinen Aufgaben verbinden.",
      listIds.zeit
    ),
  ];

  // Home und Motivation
  const homeTasks: Task[] = [
    createTask(
      "Hol dir ein bisschen zusätzliche Motivation!",
      "Wechsle zur Seite „Zitate“ und lass dir ein motivierendes Zitat anzeigen. Wenn du einen kleinen Motivationsschub brauchst oder dir gerade die Energie fehlt, kann ein inspirierender Spruch helfen, wieder mit frischem Elan an deine Aufgaben heranzugehen.",
      listIds.home
    ),
    createTask(
      "Entdecke deine Home-Seite",
      "Wechsle zur Home-Seite und verschaffe dir einen Überblick. Hier findest du deinen Kalender, deine Listen und ein motivierendes Zitat. Nutze die Home-Seite als zentralen Ausgangspunkt, um deine Termine und Aufgaben im Blick zu behalten und motiviert in den Tag zu starten.",
      listIds.home
    ),
    createTask(
      "Entdecke deine Benachrichtigungen",
      "Wenn du deine Home-Seite öffnest, bekommst du mitgeteilt, wieviele offene Aufgaben du hast. Probiere aus was passiert, wenn du die Benachrichtigungen stumm- oder ausschaltest. Wenn du zu viele offene Aufgaben hast, ändert sich die Ausgabe",
      listIds.home
    ),
    createTask(
      "Schließe deine Einführung ab!",
      "Du hast die wichtigsten Funktionen deiner OrgaApp kennengelernt! Öffne den Reiter „Ziele“, wähle dein Ziel „Willkommen!“ aus und markiere es über den entsprechenden Button als erreicht. Herzlichen Glückwunsch! Damit hast du deine Einführung erfolgreich abgeschlossen. 🎉",
      listIds.home
    ),
  ];

  const allTasks: Task[] = [
    ...listenTasks,
    ...zieleTasks,
    ...habitsTasks,
    ...zeitTasks,
    ...homeTasks,
  ];

  const lists: List[] = [
    {
      id: listIds.listen,
      title: "Listen & Backlog",
      description: "Schön, dass du hier bist! 🎉 Diese Liste hilft dir dabei, deine OrgaApp Schritt für Schritt kennenzulernen. Klappe die einzelnen Aufgaben auf, um ihre ausführlichen Beschreibungen zu lesen und zu erfahren, was du ausprobieren kannst. Du kannst Aufgaben direkt über das Kontrollkästchen als erledigt markieren und so deinen Fortschritt verfolgen. Viel Spaß beim Entdecken! Wenn du alle Aufgaben dieser Liste erledigt hast, findest du in den weiteren Listen Erklärungen zu anderen Features.",
      createdAt: now,
      tasks: listenTasks.map(task => task.id),
    },
    {
      id: listIds.habits,
      title: "Habits",
      description: "Entdecke, wie du Gewohnheiten anlegst, deinen Fortschritt trackst und deine Entwicklung im Kalender beobachtest.",
      createdAt: now,
      tasks: habitsTasks.map(task => task.id),
    },
    {
      id: listIds.ziele,
      title: "Ziele & Planung",
      description: "Lerne, wie du persönliche Ziele erstellst, mit Listen und Habits verknüpfst und deine Aufgaben im Kalender planst.",
      createdAt: now,
      tasks: zieleTasks.map(task => task.id),
    },
    {
      id: listIds.zeit,
      title: "Zeit & Timer",
      description: "Lerne die verschiedenen Timer, persönlichen Wecker und aufgabenbezogenen Erinnerungen kennen.",
      createdAt: now,
      tasks: zeitTasks.map(task => task.id),
    },
    {
      id: listIds.home,
      title: "Home & Motivation",
      description: "Entdecke deine Home-Seite, hole dir Motivation durch Zitate und schließe deine Einführung ab, indem du das Willkommensziel als erreicht markierst.",
      createdAt: now,
      tasks: homeTasks.map(task => task.id),
    },
  ];

  const backlog: Backlog = {
    id: "backlog",
    title: "Backlog",
    description: "Alle deine Aufgaben unabhängig von ihrer Listenzugehörigkeit.",
    createdAt: now,
    tasks: allTasks,
  };

  const welcomeZiel: Ziel = {
    id: welcomeZielId,
    title: "Willkommen!",
    description: "Lerne die wichtigsten Funktionen deiner OrgaApp Schritt für Schritt kennen und entdecke, wie du deine Aufgaben, Ziele und Gewohnheiten organisieren kannst.",
    createdAt: now,
    lists: lists.map(list => list.id),
    habits: [],
  };

  return {
    lists,
    backlog,
    ziellog: [welcomeZiel],
  };
}