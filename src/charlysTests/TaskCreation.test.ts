import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import {
  createTask,
  addList,
  addTaskToList,
} from '../taskAndListLogik';

import { lists, backlog, updateAppData } from '../persistence/state';

describe('Adding tasks to lists', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
    vi.clearAllMocks();
  });

  it('adds the task to the list task array', async () => {
    await createTask({ title: 'Shopping', description: 'Buy milk' });
    await addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);

    expect(list.tasks).toContain(task.id);
  });

  it('adds the list ID to the task lists array', async () => {
    await createTask({ title: 'Shopping', description: 'Buy milk' });
    await addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);

    expect(task.lists).toContain(list.id);
  });

  it('keeps the task in the global backlog', async () => {
    await createTask({ title: 'Shopping', description: 'Buy milk' });
    await addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];

    await addTaskToList(task.id, lists[0].id);

    expect(backlog.tasks).toContain(task);
  });

  it('does not create a duplicate task in the global backlog', async () => {
    await createTask({ title: 'Shopping', description: 'Buy milk' });
    await addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const originalCount = backlog.tasks.length;

    await addTaskToList(task.id, lists[0].id);

    expect(backlog.tasks).toHaveLength(originalCount);
  });

  it('can add multiple tasks to the same list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await addList('Work', 'Work tasks');

    const list = lists[0];

    await addTaskToList(backlog.tasks[0].id, list.id);
    await addTaskToList(backlog.tasks[1].id, list.id);

    expect(list.tasks).toHaveLength(2);
    expect(
      list.tasks.map(taskId =>
        backlog.tasks.find(task => task.id === taskId)?.title,
      ),
    ).toEqual(['Task A', 'Task B']);
  });

  it('can add one task to multiple lists', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Work tasks');
    await addList('Personal', 'Personal tasks');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    await addTaskToList(task.id, work.id);
    await addTaskToList(task.id, personal.id);

    expect(task.lists).toContain(work.id);
    expect(task.lists).toContain(personal.id);
    expect(work.tasks).toContain(task.id);
    expect(personal.tasks).toContain(task.id);
  });

  it('does not add the same task to the same list twice', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Work tasks');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);
    await addTaskToList(task.id, list.id);

    expect(task.lists.filter(id => id === list.id)).toHaveLength(1);
    expect(list.tasks.filter(item => item === task.id)).toHaveLength(1);
  });

  it('does not modify data when the task does not exist', async () => {
    await addList('Work', 'Work tasks');

    const list = lists[0];

    await addTaskToList('nonexistent-task', list.id);

    expect(list.tasks).toHaveLength(0);
  });

  it('does not modify data when the list does not exist', async () => {
    await createTask({ title: 'Task A', description: '' });

    const task = backlog.tasks[0];

    await addTaskToList(task.id, 'nonexistent-list');

    expect(task.lists).toEqual(['backlog']);
    expect(backlog.tasks).toContain(task);
  });

  it('persists changes when a task is added to a list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Work tasks');

    vi.clearAllMocks();

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);

    expect(updateAppData).toHaveBeenCalled();
  });
});