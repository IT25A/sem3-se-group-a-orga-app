import { 
  describe, 
  it, 
  expect, 
  beforeEach 
} from 'vitest';

import { 
  backlog,
  lists,
  createTask,
  addList,
  addTaskToList,
  deleteList,
} from '../create';

describe('Deleting lists', () => {
  beforeEach(() => {
    lists.length = 0;
  });

  it('removes a list from the global lists array', () => {
    addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    deleteList(id);

    expect(lists).toHaveLength(0);
  });

  it('deletes only the selected list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');
    addList('Personal', 'Persönlich');

    const idToDelete = lists[1].id;

    deleteList(idToDelete);

    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Personal',
    ]);
  });

  it('preserves the order of the remaining lists', () => {
    addList('A', 'Beschreibung A');
    addList('B', 'Beschreibung B');
    addList('C', 'Beschreibung C');
    addList('D', 'Beschreibung D');

    deleteList(lists[1].id);

    expect(lists.map(list => list.title)).toEqual([
      'A',
      'C',
      'D',
    ]);
  });

  it('does nothing if the list does not exist', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    deleteList('nonexistent-id');

    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Work',
    ]);
  });

  it('does not throw an error when deleting from an empty array', () => {
    expect(() => deleteList('nonexistent-id')).not.toThrow();
    expect(lists).toHaveLength(0);
  });

  it('can delete the last remaining list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    deleteList(lists[0].id);
    deleteList(lists[0].id);

    expect(lists).toHaveLength(0);
  });
});

//Weitere Tests die sich mit Aufgaben befassen wenn listen gelöscht werden
describe('Deleting lists', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
  });

  it('removes the list from the lists array', () => {
    addList('Work', 'Tasks related to work');
    const list = lists[0];

    deleteList(list.id);

    expect(lists).not.toContain(list);
    expect(lists.some(item => item.id === list.id)).toBe(false);
  });

  it('removes the deleted list ID from task references', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);
    deleteList(list.id);

    expect(task.lists).not.toContain(list.id);
  });

  it('keeps tasks in the backlog after deleting a list', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);
    deleteList(list.id);

    expect(backlog.tasks).toContain(task);
    expect(backlog.tasks).toHaveLength(1);
  });

  it('removes the deleted list ID from every task assigned to it', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Tasks related to work');

    const list = lists[0];

    addTaskToList(backlog.tasks[0].id, list.id);
    addTaskToList(backlog.tasks[1].id, list.id);

    deleteList(list.id);

    for (const task of backlog.tasks) {
      expect(task.lists).not.toContain(list.id);
    }
  });

  it('preserves tasks in other lists', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');
    addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    addTaskToList(task.id, work.id);
    addTaskToList(task.id, personal.id);

    deleteList(work.id);

    expect(task.lists).not.toContain(work.id);
    expect(task.lists).toContain(personal.id);
    expect(lists).toContain(personal);
    expect(personal.tasks.some(item => item === task.id)).toBe(true);
  });

  it('deletes an empty list without affecting tasks', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Empty list', 'An empty list');

    const task = backlog.tasks[0];
    const list = lists[0];

    deleteList(list.id);

    expect(lists).not.toContain(list);
    expect(backlog.tasks).toContain(task);
    expect(task.lists).toEqual([backlog.id]);
  });

  it('does not change data when the list does not exist', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];
    const originalLists = [...lists];
    const originalTaskLists = [...task.lists];

    deleteList('nonexistent-list');

    expect(lists).toEqual(originalLists);
    expect(task.lists).toEqual(originalTaskLists);
    expect(backlog.tasks).toContain(task);
    expect(list.id).toBe(originalLists[0].id);
  });

  it('does not remove references to unrelated lists', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');
    addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    addTaskToList(task.id, work.id);
    addTaskToList(task.id, personal.id);

    deleteList(work.id);

    expect(task.lists).toEqual([backlog.id, personal.id]);
  });
});
