
import { beforeEach, describe, expect, it } from 'vitest';
import {
  backlog,
  lists,
  createTask,
  addList,
  addTaskToList,
  deleteListsRecursivly,
} from '../taskAndListLogik';

describe('deleteListsRecursivly', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
  });

  it('deletes all tasks belonging to the specified list', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Tasks related to work');

    const [taskA, taskB] = backlog.tasks;
    const work = lists[0];

    addTaskToList(taskA.id, work.id);
    addTaskToList(taskB.id, work.id);

    deleteListsRecursivly(work.id);

    expect(backlog.tasks).toHaveLength(0);
    expect(work.tasks).toHaveLength(0);
  });

  it('removes deleted tasks from the backlog', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const work = lists[0];

    addTaskToList(task.id, work.id);
    deleteListsRecursivly(work.id);

    expect(backlog.tasks).not.toContain(task);
  });

  it('preserves tasks that do not belong to the specified list', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Tasks related to work');

    const [taskA, taskB] = backlog.tasks;
    const work = lists[0];

    addTaskToList(taskA.id, work.id);

    deleteListsRecursivly(work.id);

    expect(backlog.tasks).toContain(taskB);
    expect(backlog.tasks).toHaveLength(1);
  });

  it('does delete the list itself', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const work = lists[0];
    addTaskToList(backlog.tasks[0].id, work.id);

    deleteListsRecursivly(work.id);

    expect(lists).not.toContain(work);
    expect(lists).toHaveLength(0);
  });

  it('handles an empty list', () => {
    addList('Empty', 'An empty list');

    const empty = lists[0];

    expect(() => deleteListsRecursivly(empty.id)).not.toThrow();
    expect(lists).not.toContain(empty);
    expect(backlog.tasks).toHaveLength(0);
  });

  it('does nothing when the list does not exist', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const work = lists[0];

    addTaskToList(task.id, work.id);

    expect(() => deleteListsRecursivly('nonexistent-list')).not.toThrow();

    expect(backlog.tasks).toContain(task);
    expect(work.tasks).toContainEqual(task.id);
    expect(task.lists).toContain(work.id);
  });

  
it('deletes only tasks that belong exclusively to the specified list and the backlog', () => {
  createTask({ title: 'Task A', description: '' });
  createTask({ title: 'Task B', description: '' });
  createTask({ title: 'Task C', description: '' });

  addList('Work', 'Tasks related to work');
  addList('Personal', 'Personal tasks');

  const [taskA, taskB, taskC] = backlog.tasks;
  const [work, personal] = lists;

  addTaskToList(taskA.id, work.id);
  addTaskToList(taskA.id, personal.id);

  addTaskToList(taskB.id, personal.id);

  addTaskToList(taskC.id, work.id);

  deleteListsRecursivly(work.id);

  expect(backlog.tasks).toContain(taskA);
  expect(personal.tasks).toContainEqual(taskA.id);
  expect(taskA.lists).toContain(personal.id);
  expect(taskA.lists).not.toContain(work.id);

  expect(backlog.tasks).toContain(taskB);
  expect(personal.tasks).toContainEqual(taskB.id);

  expect(backlog.tasks).not.toContain(taskC);
  expect(work.tasks.some(task => task === taskC.id)).toBe(false);


  expect(lists).not.toContain(work);
  expect(lists).toContain(personal);
});


  it('preserves unrelated lists and their tasks', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Tasks related to work');
    addList('Personal', 'Personal tasks');

    const [taskA, taskB] = backlog.tasks;
    const [work, personal] = lists;

    addTaskToList(taskA.id, work.id);
    addTaskToList(taskB.id, personal.id);

    deleteListsRecursivly(work.id);

    expect(lists).toContain(personal);
    expect(personal.tasks).toContainEqual(taskB.id);
    expect(backlog.tasks).toContain(taskB);
  });
});
