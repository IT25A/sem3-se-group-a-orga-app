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
  editTaskTitle,
  editTaskDescription,
  editTaskDueDate,
  editTaskPriority,
  editTaskComplexity,
  editTaskTimeEstimate,
  editTaskCompleted,
  addTaskToList,
  removeTaskFromList,
} from '../taskAndListLogik';

import type { Priority, Complexity, TimeEstimate } from '../taskAndListLogik';

import {
  lists,
  backlog,
  updateAppData,
} from '../persistence/state';

const priorityA = 'Low' as Priority;
const priorityB = 'High' as Priority;

const complexityA = 'Easy' as Complexity;
const complexityB = 'Hard' as Complexity;

const timeEstimateA = 'Short' as TimeEstimate;
const timeEstimateB = 'Long' as TimeEstimate;

describe('Editing tasks', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
    vi.clearAllMocks();
  });

  // TITLE

  describe('Editing the title', () => {
    it('changes the title', async () => {
      await createTask({ title: 'Old title', description: '' });
      const task = backlog.tasks[0];

      await editTaskTitle(task.id, 'New title');

      expect(task.title).toBe('New title');
    });

    it('does not change the description when editing the title', async () => {
      await createTask({ title: 'Old title', description: 'Keep this' });
      const task = backlog.tasks[0];

      await editTaskTitle(task.id, 'New title');

      expect(task.description).toBe('Keep this');
    });

    it('allows an empty title if empty titles are supported', async () => {
      await createTask({ title: 'Old title', description: '' });
      const task = backlog.tasks[0];

      await editTaskTitle(task.id, '');

      expect(task.title).toBe('');
    });

    it('does not change the title when the task does not exist', async () => {
      await createTask({ title: 'Original', description: '' });

      await editTaskTitle('nonexistent-task', 'Changed');

      expect(backlog.tasks[0].title).toBe('Original');
    });
  });

  // DESCRIPTION

  describe('Editing the description', () => {
    it('changes the description', async () => {
      await createTask({ title: 'Task', description: 'Old description' });
      const task = backlog.tasks[0];

      await editTaskDescription(task.id, 'New description');

      expect(task.description).toBe('New description');
    });

    it('does not change the title', async () => {
      await createTask({ title: 'Keep this title', description: 'Old' });
      const task = backlog.tasks[0];

      await editTaskDescription(task.id, 'New');

      expect(task.title).toBe('Keep this title');
    });

    it('allows an empty description', async () => {
      await createTask({ title: 'Task', description: 'Some description' });
      const task = backlog.tasks[0];

      await editTaskDescription(task.id, '');

      expect(task.description).toBe('');
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: 'Original' });

      await editTaskDescription('nonexistent-task', 'Changed');

      expect(backlog.tasks[0].description).toBe('Original');
    });
  });

  // DUE DATE

  describe('Editing the due date', () => {
    it('sets a due date', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];
      const dueDate = new Date('2027-01-15T12:00:00Z');

      await editTaskDueDate(task.id, dueDate);

      expect(task.dueDate?.getTime()).toBe(dueDate.getTime());
    });

    it('changes an existing due date', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      const firstDate = new Date('2027-01-15T12:00:00Z');
      const secondDate = new Date('2027-02-20T12:00:00Z');

      await editTaskDueDate(task.id, firstDate);
      await editTaskDueDate(task.id, secondDate);

      expect(task.dueDate?.getTime()).toBe(secondDate.getTime());
    });

    it('clears the due date when undefined is passed', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskDueDate(task.id, new Date('2027-01-15T12:00:00Z'));
      await editTaskDueDate(task.id, undefined);

      expect(task.dueDate).toBeUndefined();
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: '' });

      await expect(
        editTaskDueDate(
          'nonexistent-task',
          new Date('2027-01-15T12:00:00Z'),
        ),
      ).resolves.toBeUndefined();

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // PRIORITY

  describe('Editing priority', () => {
    it('changes the priority', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskPriority(task.id, priorityA);
      await editTaskPriority(task.id, priorityB);

      expect(task.priority).toBe(priorityB);
    });

    it('does not change other task properties', async () => {
      await createTask({ title: 'Task', description: 'Description' });
      const task = backlog.tasks[0];
      const originalTitle = task.title;
      const originalDescription = task.description;

      await editTaskPriority(task.id, priorityB);

      expect(task.title).toBe(originalTitle);
      expect(task.description).toBe(originalDescription);
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: '' });

      await editTaskPriority('nonexistent-task', priorityB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // COMPLEXITY

  describe('Editing complexity', () => {
    it('changes the complexity', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskComplexity(task.id, complexityA);
      await editTaskComplexity(task.id, complexityB);

      expect(task.complexity).toBe(complexityB);
    });

    it('does not change the priority', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskPriority(task.id, priorityA);
      await editTaskComplexity(task.id, complexityB);

      expect(task.priority).toBe(priorityA);
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: '' });

      await editTaskComplexity('nonexistent-task', complexityB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // TIME ESTIMATE

  describe('Editing time estimate', () => {
    it('changes the time estimate', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskTimeEstimate(task.id, timeEstimateA);
      await editTaskTimeEstimate(task.id, timeEstimateB);

      expect(task.timeEstimate).toBe(timeEstimateB);
    });

    it('does not change the complexity', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskComplexity(task.id, complexityA);
      await editTaskTimeEstimate(task.id, timeEstimateB);

      expect(task.complexity).toBe(complexityA);
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: '' });

      await editTaskTimeEstimate('nonexistent-task', timeEstimateB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // COMPLETED

  describe('Editing completed status', () => {
    it('marks a task as completed', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskCompleted(task.id, true);

      expect(task.completed).toBe(true);
    });

    it('marks a completed task as incomplete', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskCompleted(task.id, true);
      await editTaskCompleted(task.id, false);

      expect(task.completed).toBe(false);
    });

    it('does not remove a completed task from the backlog', async () => {
      await createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      await editTaskCompleted(task.id, true);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(1);
    });

    it('does nothing if the task does not exist', async () => {
      await createTask({ title: 'Task', description: '' });

      await editTaskCompleted('nonexistent-task', true);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // ADDING LIST MEMBERSHIPS

  describe('Adding a task to lists', () => {
    it('adds the list ID to the task', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);

      expect(task.lists).toContain(list.id);
    });

    it('adds the task to the list task array', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);

      expect(list.tasks).toContain(task.id);
    });

    it('does not add the same task twice to the same list', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);
      await addTaskToList(task.id, list.id);

      expect(task.lists.filter(id => id === list.id)).toHaveLength(1);
      expect(list.tasks.filter(item => item === task.id)).toHaveLength(1);
    });

    it('allows a task to belong to multiple lists', async () => {
      await createTask({ title: 'Task', description: '' });
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

    it('keeps the task in the backlog after adding it to a list', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];
      const originalCount = backlog.tasks.length;

      await addTaskToList(task.id, list.id);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(originalCount);
    });
  });

  // REMOVING LIST MEMBERSHIPS

  describe('Removing a task from lists', () => {
    it('removes the list ID from the task', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);
      await removeTaskFromList(task.id, list.id);

      expect(task.lists).not.toContain(list.id);
    });

    it('removes the task from the list task array', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);
      await removeTaskFromList(task.id, list.id);

      expect(list.tasks).not.toContain(task.id);
    });

    it('keeps the task in the backlog after removing it from a list', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await addTaskToList(task.id, list.id);
      await removeTaskFromList(task.id, list.id);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(1);
    });

    it('preserves membership in other lists', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');
      await addList('Personal', 'Personal tasks');

      const task = backlog.tasks[0];
      const [work, personal] = lists;

      await addTaskToList(task.id, work.id);
      await addTaskToList(task.id, personal.id);
      await removeTaskFromList(task.id, work.id);

      expect(task.lists).not.toContain(work.id);
      expect(task.lists).toContain(personal.id);
      expect(personal.tasks).toContain(task.id);
    });

    it('does not remove other tasks from the list', async () => {
      await createTask({ title: 'Task A', description: '' });
      await createTask({ title: 'Task B', description: '' });
      await addList('Work', 'Work tasks');

      const [taskA, taskB] = backlog.tasks;
      const list = lists[0];

      await addTaskToList(taskA.id, list.id);
      await addTaskToList(taskB.id, list.id);
      await removeTaskFromList(taskA.id, list.id);

      expect(list.tasks).not.toContain(taskA.id);
      expect(list.tasks).toContain(taskB.id);
      expect(backlog.tasks).toContain(taskA);
      expect(backlog.tasks).toContain(taskB);
    });

    it('does not fail when the task is not in the specified list', async () => {
      await createTask({ title: 'Task', description: '' });
      await addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      await expect(
        removeTaskFromList(task.id, list.id),
      ).resolves.toBeUndefined();

      expect(backlog.tasks).toContain(task);
      expect(task.lists).not.toContain(list.id);
    });
  });

  // BACKLOG INTEGRITY

  describe('Backlog integrity', () => {
    it('keeps the same task object in the backlog after editing multiple fields', async () => {
      await createTask({ title: 'Original', description: 'Original description' });
      const task = backlog.tasks[0];

      await editTaskTitle(task.id, 'Updated');
      await editTaskDescription(task.id, 'Updated description');
      await editTaskPriority(task.id, priorityB);
      await editTaskComplexity(task.id, complexityB);
      await editTaskTimeEstimate(task.id, timeEstimateB);
      await editTaskCompleted(task.id, true);

      expect(backlog.tasks).toHaveLength(1);
      expect(backlog.tasks[0]).toBe(task);
      expect(backlog.tasks[0].id).toBe(task.id);
    });

    it('does not create duplicate tasks when editing', async () => {
      await createTask({ title: 'Task A', description: '' });
      await createTask({ title: 'Task B', description: '' });

      const [taskA, taskB] = backlog.tasks;

      await editTaskTitle(taskA.id, 'Changed A');
      await editTaskDescription(taskB.id, 'Changed B');
      await editTaskCompleted(taskA.id, true);

      expect(backlog.tasks).toHaveLength(2);
      expect(backlog.tasks.filter(t => t.id === taskA.id)).toHaveLength(1);
      expect(backlog.tasks.filter(t => t.id === taskB.id)).toHaveLength(1);
    });

    it('does not change unrelated tasks when editing one task', async () => {
      await createTask({ title: 'Task A', description: 'A' });
      await createTask({ title: 'Task B', description: 'B' });

      const [taskA, taskB] = backlog.tasks;

      await editTaskTitle(taskA.id, 'Changed A');

      expect(taskA.title).toBe('Changed A');
      expect(taskB.title).toBe('Task B');
      expect(taskB.description).toBe('B');
      expect(backlog.tasks).toHaveLength(2);
    });
  });

  // PERSISTENCE

  it('persists task edits and list membership changes', async () => {
    await createTask({ title: 'Task', description: '' });
    await addList('Work', 'Work tasks');

    vi.clearAllMocks();

    const task = backlog.tasks[0];
    const list = lists[0];

    await editTaskTitle(task.id, 'Updated');
    expect(updateAppData).toHaveBeenCalled();

    vi.clearAllMocks();

    await addTaskToList(task.id, list.id);
    expect(updateAppData).toHaveBeenCalled();

    vi.clearAllMocks();

    await removeTaskFromList(task.id, list.id);
    expect(updateAppData).toHaveBeenCalled();
  });
});