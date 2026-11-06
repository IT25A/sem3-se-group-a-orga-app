
import {
  
  createTask,
  addList,
  addTaskToList,
  editTaskPriority,
  editTaskComplexity,
  editTaskTimeEstimate,
  editTaskCompleted,
} from '../taskAndListLogik';
import { lists } from '../persistence/state';
import type {
  Priority,
  Complexity,
  TimeEstimate,
} from '../taskAndListLogik';

export async function populateTestData() {
  // Create lists.
  await addList('Arbeit', 'Aufgaben rund um Arbeit und Projekte');
  await addList('Privat', 'Persönliche Aufgaben und Besorgungen');
  await addList('Lernen', 'Lern- und Studienaufgaben');
  await addList('Leere Liste', 'Eine Liste ohne Aufgaben');

  // Retrieve the created lists.
  const getList = (title: string) => {
    const list = lists.find((item) => item.title === title);

    if (!list) {
      throw new Error(`Testdaten konnten nicht erstellt werden: Liste "${title}" nicht gefunden`);
    }

    return list;
  };

  const workList = await getList('Arbeit');
  const personalList = await getList('Privat');
  const studyList = await getList('Lernen');
  const emptyList = await getList('Leere Liste');

  const backlogOnlyTask = await createTask({
    title: 'Buch lesen',
    description: '20 Seiten lesen',
  });

  const workTask = await createTask({
    title: 'Projektbericht fertigstellen',
    description: 'Den Abschlussbericht fertigstellen',
  });

  const sharedTask = await createTask({
    title: 'Präsentation vorbereiten',
    description: 'Folien für das Meeting erstellen',
  });

  const personalTask = await createTask({
    title: 'Einkaufen',
    description: 'Milch, Brot und Obst kaufen',
  });

  const studyTask = await createTask({
    title: 'TypeScript wiederholen',
    description: 'Typen und Interfaces üben',
  });

  const completedTask = await createTask({
    title: 'Rechnung versenden',
    description: 'Die Rechnung an den Kunden schicken',
  });

  const multiListTask = await createTask({
    title: 'Woche planen',
    description: 'Arbeit, Lernen und private Aufgaben organisieren',
  });

  // Assign tasks to lists.
  await addTaskToList(workTask.id, workList.id);

  await addTaskToList(sharedTask.id, workList.id);
  await addTaskToList(sharedTask.id, personalList.id);

  await addTaskToList(personalTask.id, personalList.id);
  await addTaskToList(studyTask.id, studyList.id);
  await addTaskToList(completedTask.id, workList.id);

  await addTaskToList(multiListTask.id, workList.id);
  await addTaskToList(multiListTask.id, personalList.id);
  await addTaskToList(multiListTask.id, studyList.id);

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
  await editTaskPriority(workTask.id, priorityHigh);
  await editTaskComplexity(workTask.id, complexityHard);
  await editTaskTimeEstimate(workTask.id, timeLong);

  await editTaskPriority(sharedTask.id, priorityMedium);
  await editTaskComplexity(sharedTask.id, complexityMedium);
  await editTaskTimeEstimate(sharedTask.id, timeMedium);

  await editTaskPriority(personalTask.id, priorityLow);
  await editTaskComplexity(personalTask.id, complexityEasy);
  await editTaskTimeEstimate(personalTask.id, timeShort);

  await editTaskPriority(studyTask.id, priorityHigh);
  await editTaskComplexity(studyTask.id, complexityMedium);
  await editTaskTimeEstimate(studyTask.id, timeLong);

  await editTaskPriority(completedTask.id, priorityHigh);
  await editTaskCompleted(completedTask.id, true);

  await editTaskPriority(multiListTask.id, priorityMedium);

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
