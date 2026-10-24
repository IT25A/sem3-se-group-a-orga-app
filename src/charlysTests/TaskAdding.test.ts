import { beforeEach, describe, expect, it } from 'vitest';
import {
  backlog,
  lists,
  createTask,
  addList,
  addTaskToList,
} from '../taskAndListLogik';

describe('Adding tasks to lists', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
  });

  it('adds the task to the list task array', () => {
    createTask({ title: 'Shopping', description: 'Buy milk' });
    addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);

    expect(list.tasks).toContainEqual(task.id);
  });

  it('adds the list ID to the task lists array', () => {
    createTask({ title: 'Shopping', description: 'Buy milk' });
    addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);

    expect(task.lists).toContain(list.id);
  });

  it('keeps the task in the global backlog', () => {
    createTask({ title: 'Shopping', description: 'Buy milk' });
    addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];

    addTaskToList(task.id, lists[0].id);

    expect(backlog.tasks).toContain(task);
  });

  it('does not create a duplicate task in the global backlog', () => {
    createTask({ title: 'Shopping', description: 'Buy milk' });
    addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const originalCount = backlog.tasks.length;

    addTaskToList(task.id, lists[0].id);

    expect(backlog.tasks).toHaveLength(originalCount);
  });

  it('can add multiple tasks to the same list', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Work tasks');

    const list = lists[0];

    addTaskToList(backlog.tasks[0].id, list.id);
    addTaskToList(backlog.tasks[1].id, list.id);

    expect(list.tasks).toHaveLength(2);
    expect(list.tasks.map(task => (backlog.tasks.find(t => t.id === task))?.title)).toEqual([
      'Task A',
      'Task B',
    ]);
  });

  it('can add one task to multiple lists', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Work tasks');
    addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    addTaskToList(task.id, work.id);
    addTaskToList(task.id, personal.id);

    expect(task.lists).toContain(work.id);
    expect(task.lists).toContain(personal.id);
    expect(work.tasks).toContainEqual(task.id);
    expect(personal.tasks).toContainEqual(task.id);
  });

  it('does not add the same task to the same list twice', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Work tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);
    addTaskToList(task.id, list.id);

    expect(task.lists.filter(id => id === list.id)).toHaveLength(1);
    expect(list.tasks.filter(item => item === task.id)).toHaveLength(1);
  });

  it('does not modify data when the task does not exist', () => {
    addList('Work', 'Work tasks');

    const list = lists[0];

    addTaskToList('nonexistent-task', list.id);

    expect(list.tasks).toHaveLength(0);
  });

  it('does not modify data when the list does not exist', () => {
    createTask({ title: 'Task A', description: '' });

    const task = backlog.tasks[0];

    addTaskToList(task.id, 'nonexistent-list');

    expect(task.lists).toEqual(["backlog"]);
    expect(backlog.tasks).toContain(task);
  });
});