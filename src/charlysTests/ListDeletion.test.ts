
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';

// --------------------------------
// MOCKS
// --------------------------------

vi.mock('../persistence/state', () => ({
  lists: [],
  backlog: {
    id: 'backlog',
    title: 'Backlog',
    description: 'Backlog',
    createdAt: new Date(),
    tasks: [],
  },
  eventlog: [],
  ziellog: [],
  updateAppData: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../calendar', () => ({
  refreshCalendar: vi.fn(),
}));

vi.mock('../persistence/storage', () => ({
  saveEventlog: vi.fn(),
}));

// --------------------------------
// IMPORTS
// --------------------------------

import {
  createTask,
  addList,
  addTaskToList,
  deleteList,
} from '../taskAndListLogik';

import {
  lists,
  backlog,
  updateAppData,
} from '../persistence/state';

// --------------------------------
// TESTS: LISTEN LÖSCHEN
// --------------------------------

describe('Deleting lists', () => {

  beforeEach(() => {
    lists.length = 0;
    backlog.tasks.length = 0;
    vi.clearAllMocks();
  });

  it('removes a list from the global lists array', async () => {
    await addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    await deleteList(id);

    expect(lists).toHaveLength(0);
  });

  it('deletes only the selected list', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');
    await addList('Personal', 'Persönlich');

    const idToDelete = lists[1].id;

    await deleteList(idToDelete);

    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Personal',
    ]);
  });

  it('preserves the order of the remaining lists', async () => {
    await addList('A', 'Beschreibung A');
    await addList('B', 'Beschreibung B');
    await addList('C', 'Beschreibung C');
    await addList('D', 'Beschreibung D');

    await deleteList(lists[1].id);

    expect(lists.map(list => list.title)).toEqual([
      'A',
      'C',
      'D',
    ]);
  });

  it('does nothing if the list does not exist', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    const originalLists = [...lists];

    await deleteList('nonexistent-id');

    expect(lists).toEqual(originalLists);
  });

  it('does not throw an error when deleting from an empty array', async () => {
    await expect(
      deleteList('nonexistent-id')
    ).resolves.toBeUndefined();

    expect(lists).toHaveLength(0);
  });

  it('can delete the last remaining list', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    await deleteList(lists[0].id);
    await deleteList(lists[0].id);

    expect(lists).toHaveLength(0);
  });

  it('calls updateAppData when deleting an existing list', async () => {
    await addList('Shopping', 'Einkaufen');

    vi.clearAllMocks();

    await deleteList(lists[0].id);

    expect(updateAppData).toHaveBeenCalledTimes(1);
  });

  it('does not call updateAppData when the list does not exist', async () => {
    await deleteList('nonexistent-id');

    expect(updateAppData).not.toHaveBeenCalled();
  });
});

// --------------------------------
// TESTS: LISTEN UND AUFGABEN
// --------------------------------

describe('Deleting lists with assigned tasks', () => {

  beforeEach(() => {
    lists.length = 0;
    backlog.tasks.length = 0;
    vi.clearAllMocks();
  });

  it('removes the list from the lists array', async () => {
    await addList('Work', 'Tasks related to work');
    const list = lists[0];

    await deleteList(list.id);

    expect(lists).not.toContain(list);
    expect(lists.some(item => item.id === list.id)).toBe(false);
  });

  it('removes the deleted list ID from task references', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);
    await deleteList(list.id);

    expect(task.lists).not.toContain(list.id);
  });

  it('keeps tasks in the backlog after deleting a list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);
    await deleteList(list.id);

    expect(backlog.tasks).toContain(task);
    expect(backlog.tasks).toHaveLength(1);
  });

  it('removes the deleted list ID from every task assigned to it', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await addList('Work', 'Tasks related to work');

    const list = lists[0];

    await addTaskToList(backlog.tasks[0].id, list.id);
    await addTaskToList(backlog.tasks[1].id, list.id);

    await deleteList(list.id);

    for (const task of backlog.tasks) {
      expect(task.lists).not.toContain(list.id);
    }
  });

  it('preserves tasks in other lists', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');
    await addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    await addTaskToList(task.id, work.id);
    await addTaskToList(task.id, personal.id);

    await deleteList(work.id);

    expect(task.lists).not.toContain(work.id);
    expect(task.lists).toContain(personal.id);
    expect(lists).toContain(personal);
    expect(personal.tasks).toContain(task.id);
  });

  it('deletes an empty list without affecting tasks', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Empty list', 'An empty list');

    const task = backlog.tasks[0];
    const list = lists[0];

    await deleteList(list.id);

    expect(lists).not.toContain(list);
    expect(backlog.tasks).toContain(task);
    expect(task.lists).toEqual([backlog.id]);
  });

  it('does not change data when the list does not exist', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const originalLists = [...lists];
    const originalTaskLists = [...task.lists];

    await deleteList('nonexistent-list');

    expect(lists).toEqual(originalLists);
    expect(task.lists).toEqual(originalTaskLists);
    expect(backlog.tasks).toContain(task);
  });

  it('does not remove references to unrelated lists', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');
    await addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    await addTaskToList(task.id, work.id);
    await addTaskToList(task.id, personal.id);

    await deleteList(work.id);

    expect(task.lists).toEqual([backlog.id, personal.id]);
  });
});
