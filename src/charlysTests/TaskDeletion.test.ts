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
  deleteTask,
} from '../taskAndListLogik';

import { lists, backlog, updateAppData } from '../persistence/state';

describe('Deleting tasks', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
    vi.clearAllMocks();
  });

  it('removes the task from the backlog', async () => {
    await createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    await deleteTask(task.id);

    expect(backlog.tasks).not.toContain(task);
    expect(backlog.tasks.some(t => t.id === task.id)).toBe(false);
  });

  it('removes the task from its list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);
    await deleteTask(task.id);

    expect(list.tasks).not.toContain(task.id);
  });

  it('removes the task from every list it belongs to', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');
    await addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    await addTaskToList(task.id, work.id);
    await addTaskToList(task.id, personal.id);

    await deleteTask(task.id);

    expect(work.tasks).not.toContain(task.id);
    expect(personal.tasks).not.toContain(task.id);
  });

  it('preserves other tasks in the backlog', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });

    const taskA = backlog.tasks[0];
    const taskB = backlog.tasks[1];

    await deleteTask(taskA.id);

    expect(backlog.tasks).toEqual([taskB]);
  });

  it('does not delete the lists containing the task', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);
    await deleteTask(task.id);

    expect(lists).toContain(list);
    expect(lists).toHaveLength(1);
  });

  it('preserves other tasks in the same list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await addList('Work', 'Tasks related to work');

    const taskA = backlog.tasks[0];
    const taskB = backlog.tasks[1];
    const list = lists[0];

    await addTaskToList(taskA.id, list.id);
    await addTaskToList(taskB.id, list.id);

    await deleteTask(taskA.id);

    expect(list.tasks).not.toContain(taskA.id);
    expect(list.tasks).toContain(taskB.id);
  });

  it('deletes a task that is not assigned to any list', async () => {
    await createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    await deleteTask(task.id);

    expect(backlog.tasks).not.toContain(task);
  });

  it('does not modify data when the task does not exist', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    await addTaskToList(task.id, list.id);

    const originalTasks = [...backlog.tasks];
    const originalListTasks = [...list.tasks];
    const originalTaskLists = [...task.lists];

    await deleteTask('nonexistent-task');

    expect(backlog.tasks).toEqual(originalTasks);
    expect(list.tasks).toEqual(originalListTasks);
    expect(task.lists).toEqual(originalTaskLists);
  });

  it('can delete the same task twice without errors', async () => {
    await createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    await deleteTask(task.id);

    await expect(deleteTask(task.id)).resolves.toBeUndefined();

    expect(backlog.tasks).not.toContain(task);
  });

  it('persists the deletion', async () => {
    await createTask({ title: 'Task A', description: '' });

    const task = backlog.tasks[0];

    vi.clearAllMocks();

    await deleteTask(task.id);

    expect(updateAppData).toHaveBeenCalled();
  });
});