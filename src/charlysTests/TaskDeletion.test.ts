
import { beforeEach, describe, expect, it } from 'vitest';
import {
  backlog,
  lists,
  createTask,
  addList,
  addTaskToList,
  deleteTask,
} from '../taskAndListLogik';

describe('Deleting tasks', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
  });

  it('removes the task from the backlog', () => {
    createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    deleteTask(task.id);

    expect(backlog.tasks).not.toContain(task);
    expect(backlog.tasks.some(t => t.id === task.id)).toBe(false);
  });

  it('removes the task from its list', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);
    deleteTask(task.id);

    expect(list.tasks.some(t => t === task.id)).toBe(false);
  });

  it('removes the task from every list it belongs to', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');
    addList('Personal', 'Tasks related to personal life');

    const task = backlog.tasks[0];
    const [work, personal] = lists;

    addTaskToList(task.id, work.id);
    addTaskToList(task.id, personal.id);

    deleteTask(task.id);

    expect(work.tasks.some(t => t === task.id)).toBe(false);
    expect(personal.tasks.some(t => t === task.id)).toBe(false);
  });

  it('preserves other tasks in the backlog', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });

    const taskA = backlog.tasks[0];
    const taskB = backlog.tasks[1];

    deleteTask(taskA.id);

    expect(backlog.tasks).toEqual([taskB]);
  });

  it('does not delete the lists containing the task', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);
    deleteTask(task.id);

    expect(lists).toContain(list);
    expect(lists).toHaveLength(1);
  });

  it('preserves other tasks in the same list', () => {
    createTask({ title: 'Task A', description: '' });
    createTask({ title: 'Task B', description: '' });
    addList('Work', 'Tasks related to work');

    const taskA = backlog.tasks[0];
    const taskB = backlog.tasks[1];
    const list = lists[0];

    addTaskToList(taskA.id, list.id);
    addTaskToList(taskB.id, list.id);

    deleteTask(taskA.id);

    expect(list.tasks.some(t => t === taskA.id)).toBe(false);
    expect(list.tasks.some(t => t === taskB.id)).toBe(true);
  });

  it('deletes a task that is not assigned to any list', () => {
    createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    deleteTask(task.id);

    expect(backlog.tasks).not.toContain(task);
  });

  it('does not modify data when the task does not exist', () => {
    createTask({ title: 'Task A', description: '' });
    addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const list = lists[0];

    addTaskToList(task.id, list.id);

    const originalTasks = [...backlog.tasks];
    const originalListTasks = [...list.tasks];
    const originalTaskLists = [...task.lists];

    deleteTask('nonexistent-task');

    expect(backlog.tasks).toEqual(originalTasks);
    expect(list.tasks).toEqual(originalListTasks);
    expect(task.lists).toEqual(originalTaskLists);
  });

  it('can delete the same task twice without errors', () => {
    createTask({ title: 'Task A', description: '' });
    const task = backlog.tasks[0];

    deleteTask(task.id);

    expect(() => deleteTask(task.id)).not.toThrow();
    expect(backlog.tasks).not.toContain(task);
  });
});
