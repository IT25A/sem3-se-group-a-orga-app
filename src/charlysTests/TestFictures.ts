
import {
  lists,
  createTask,
  addList,
  addTaskToList,
  editTaskPriority,
  editTaskComplexity,
  editTaskTimeEstimate,
  editTaskCompleted,
} from '../taskAndListLogik';

import type {
  Priority,
  Complexity,
  TimeEstimate,
} from '../taskAndListLogik';

export function populateTestData() {
  // Create lists.
  addList('Arbeit', 'Aufgaben rund um Arbeit und Projekte');
  addList('Privat', 'Persönliche Aufgaben und Besorgungen');
  addList('Lernen', 'Lern- und Studienaufgaben');
  addList('Leere Liste', 'Eine Liste ohne Aufgaben');

  // Retrieve the created lists.
  const getList = (title: string) => {
    const list = lists.find((item) => item.title === title);

    if (!list) {
      throw new Error(`Testdaten konnten nicht erstellt werden: Liste "${title}" nicht gefunden`);
    }

    return list;
  };

  const workList = getList('Arbeit');
  const personalList = getList('Privat');
  const studyList = getList('Lernen');
  const emptyList = getList('Leere Liste');

  const backlogOnlyTask = createTask({
    title: 'Buch lesen',
    description: '20 Seiten lesen',
  });

  const workTask = createTask({
    title: 'Projektbericht fertigstellen',
    description: 'Den Abschlussbericht fertigstellen',
  });

  const sharedTask = createTask({
    title: 'Präsentation vorbereiten',
    description: 'Folien für das Meeting erstellen',
  });

  const personalTask = createTask({
    title: 'Einkaufen',
    description: 'Milch, Brot und Obst kaufen',
  });

  const studyTask = createTask({
    title: 'TypeScript wiederholen',
    description: 'Typen und Interfaces üben',
  });

  const completedTask = createTask({
    title: 'Rechnung versenden',
    description: 'Die Rechnung an den Kunden schicken',
  });

  const multiListTask = createTask({
    title: 'Woche planen',
    description: 'Arbeit, Lernen und private Aufgaben organisieren',
  });

  // Assign tasks to lists.
  addTaskToList(workTask.id, workList.id);

  addTaskToList(sharedTask.id, workList.id);
  addTaskToList(sharedTask.id, personalList.id);

  addTaskToList(personalTask.id, personalList.id);
  addTaskToList(studyTask.id, studyList.id);
  addTaskToList(completedTask.id, workList.id);

  addTaskToList(multiListTask.id, workList.id);
  addTaskToList(multiListTask.id, personalList.id);
  addTaskToList(multiListTask.id, studyList.id);

  // Use your exact union types.
  const priorityHigh: Priority = 'hoch';
  const priorityMedium: Priority = 'mittel';
  const priorityLow: Priority = 'klein';

  const complexityEasy: Complexity = 'einfach';
  const complexityMedium: Complexity = 'mittel';
  const complexityHard: Complexity = 'schwierig';

  const timeShort: TimeEstimate = 'kurz';
  const timeMedium: TimeEstimate = 'mittel';
  const timeLong: TimeEstimate = 'lang';

  // Set varied task properties.
  editTaskPriority(workTask.id, priorityHigh);
  editTaskComplexity(workTask.id, complexityHard);
  editTaskTimeEstimate(workTask.id, timeLong);

  editTaskPriority(sharedTask.id, priorityMedium);
  editTaskComplexity(sharedTask.id, complexityMedium);
  editTaskTimeEstimate(sharedTask.id, timeMedium);

  editTaskPriority(personalTask.id, priorityLow);
  editTaskComplexity(personalTask.id, complexityEasy);
  editTaskTimeEstimate(personalTask.id, timeShort);

  editTaskPriority(studyTask.id, priorityHigh);
  editTaskComplexity(studyTask.id, complexityMedium);
  editTaskTimeEstimate(studyTask.id, timeLong);

  editTaskPriority(completedTask.id, priorityHigh);
  editTaskCompleted(completedTask.id, true);

  editTaskPriority(multiListTask.id, priorityMedium);

  return {
    lists: {
      work: workList,
      personal: personalList,
      study: studyList,
      empty: emptyList,
    },
    tasks: {
      backlogOnly: backlogOnlyTask,
      work: workTask,
      shared: sharedTask,
      personal: personalTask,
      study: studyTask,
      completed: completedTask,
      multiList: multiListTask,
    },
  };
}
