
import { beforeEach, describe, expect, it } from 'vitest';
import {
  backlog,
  lists,
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

// Replace these example values with valid values from your types.
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
  });

  // -------------------------
  // TITLE
  // -------------------------

  describe('Editing the title', () => {
    it('changes the title', () => {
      createTask({ title: 'Old title', description: '' });
      const task = backlog.tasks[0];

      editTaskTitle(task.id, 'New title');

      expect(task.title).toBe('New title');
    });

    it('does not change the description when editing the title', () => {
      createTask({ title: 'Old title', description: 'Keep this' });
      const task = backlog.tasks[0];

      editTaskTitle(task.id, 'New title');

      expect(task.description).toBe('Keep this');
    });

    it('allows an empty title if empty titles are supported', () => {
      createTask({ title: 'Old title', description: '' });
      const task = backlog.tasks[0];

      editTaskTitle(task.id, '');

      expect(task.title).toBe('');
    });

    it('does not change the title when the task does not exist', () => {
      createTask({ title: 'Original', description: '' });

      editTaskTitle('nonexistent-task', 'Changed');

      expect(backlog.tasks[0].title).toBe('Original');
    });
  });

  // -------------------------
  // DESCRIPTION
  // -------------------------

  describe('Editing the description', () => {
    it('changes the description', () => {
      createTask({ title: 'Task', description: 'Old description' });
      const task = backlog.tasks[0];

      editTaskDescription(task.id, 'New description');

      expect(task.description).toBe('New description');
    });

    it('does not change the title', () => {
      createTask({ title: 'Keep this title', description: 'Old' });
      const task = backlog.tasks[0];

      editTaskDescription(task.id, 'New');

      expect(task.title).toBe('Keep this title');
    });

    it('allows an empty description', () => {
      createTask({ title: 'Task', description: 'Some description' });
      const task = backlog.tasks[0];

      editTaskDescription(task.id, '');

      expect(task.description).toBe('');
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: 'Original' });

      editTaskDescription('nonexistent-task', 'Changed');

      expect(backlog.tasks[0].description).toBe('Original');
    });
  });

  // -------------------------
  // DUE DATE
  // -------------------------

  describe('Editing the due date', () => {
    it('sets a due date', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];
      const dueDate = new Date('2027-01-15T12:00:00Z');

      editTaskDueDate(task.id, dueDate);

      expect(task.dueDate?.getTime()).toBe(dueDate.getTime());
    });

    it('changes an existing due date', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      const firstDate = new Date('2027-01-15T12:00:00Z');
      const secondDate = new Date('2027-02-20T12:00:00Z');

      editTaskDueDate(task.id, firstDate);
      editTaskDueDate(task.id, secondDate);

      expect(task.dueDate?.getTime()).toBe(secondDate.getTime());
    });

    it('clears the due date when undefined is passed', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskDueDate(task.id, new Date('2027-01-15T12:00:00Z'));
      editTaskDueDate(task.id, undefined);

      expect(task.dueDate).toBeUndefined();
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: '' });

      expect(() =>
        editTaskDueDate(
          'nonexistent-task',
          new Date('2027-01-15T12:00:00Z'),
        ),
      ).not.toThrow();

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // -------------------------
  // PRIORITY
  // -------------------------

  describe('Editing priority', () => {
    it('changes the priority', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskPriority(task.id, priorityA);
      editTaskPriority(task.id, priorityB);

      expect(task.priority).toBe(priorityB);
    });

    it('does not change other task properties', () => {
      createTask({ title: 'Task', description: 'Description' });
      const task = backlog.tasks[0];
      const originalTitle = task.title;
      const originalDescription = task.description;

      editTaskPriority(task.id, priorityB);

      expect(task.title).toBe(originalTitle);
      expect(task.description).toBe(originalDescription);
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: '' });

      editTaskPriority('nonexistent-task', priorityB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // -------------------------
  // COMPLEXITY
  // -------------------------

  describe('Editing complexity', () => {
    it('changes the complexity', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskComplexity(task.id, complexityA);
      editTaskComplexity(task.id, complexityB);

      expect(task.complexity).toBe(complexityB);
    });

    it('does not change the priority', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskPriority(task.id, priorityA);
      editTaskComplexity(task.id, complexityB);

      expect(task.priority).toBe(priorityA);
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: '' });

      editTaskComplexity('nonexistent-task', complexityB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // -------------------------
  // TIME ESTIMATE
  // -------------------------

  describe('Editing time estimate', () => {
    it('changes the time estimate', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskTimeEstimate(task.id, timeEstimateA);
      editTaskTimeEstimate(task.id, timeEstimateB);

      expect(task.timeEstimate).toBe(timeEstimateB);
    });

    it('does not change the complexity', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskComplexity(task.id, complexityA);
      editTaskTimeEstimate(task.id, timeEstimateB);

      expect(task.complexity).toBe(complexityA);
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: '' });

      editTaskTimeEstimate('nonexistent-task', timeEstimateB);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // -------------------------
  // COMPLETED
  // -------------------------

  describe('Editing completed status', () => {
    it('marks a task as completed', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskCompleted(task.id, true);

      expect(task.completed).toBe(true);
    });

    it('marks a completed task as incomplete', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskCompleted(task.id, true);
      editTaskCompleted(task.id, false);

      expect(task.completed).toBe(false);
    });

    it('does not remove a completed task from the backlog', () => {
      createTask({ title: 'Task', description: '' });
      const task = backlog.tasks[0];

      editTaskCompleted(task.id, true);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(1);
    });

    it('does nothing if the task does not exist', () => {
      createTask({ title: 'Task', description: '' });

      editTaskCompleted('nonexistent-task', true);

      expect(backlog.tasks).toHaveLength(1);
    });
  });

  // -------------------------
  // ADDING LIST MEMBERSHIPS
  // -------------------------

  describe('Adding a task to lists', () => {
    it('adds the list ID to the task', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);

      expect(task.lists).toContain(list.id);
    });

    it('adds the task to the list task array', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);

      expect(list.tasks.some(item => item === task.id)).toBe(true);
    });

    it('does not add the same task twice to the same list', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);
      addTaskToList(task.id, list.id);

      expect(task.lists.filter(id => id === list.id)).toHaveLength(1);
      expect(list.tasks.filter(item => item === task.id)).toHaveLength(1);
    });

    it('allows a task to belong to multiple lists', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');
      addList('Personal', 'Personal tasks');

      const task = backlog.tasks[0];
      const [work, personal] = lists;

      addTaskToList(task.id, work.id);
      addTaskToList(task.id, personal.id);

      expect(task.lists).toContain(work.id);
      expect(task.lists).toContain(personal.id);
      expect(work.tasks.some(item => item === task.id)).toBe(true);
      expect(personal.tasks.some(item => item === task.id)).toBe(true);
    });

    it('keeps the task in the backlog after adding it to a list', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];
      const originalCount = backlog.tasks.length;

      addTaskToList(task.id, list.id);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(originalCount);
    });
  });

  // -------------------------
  // REMOVING LIST MEMBERSHIPS
  // -------------------------

  describe('Removing a task from lists', () => {
    it('removes the list ID from the task', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);
      removeTaskFromList(task.id, list.id);

      expect(task.lists).not.toContain(list.id);
    });

    it('removes the task from the list task array', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);
      removeTaskFromList(task.id, list.id);

      expect(list.tasks.some(item => item === task.id)).toBe(false);
    });

    it('keeps the task in the backlog after removing it from a list', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      addTaskToList(task.id, list.id);
      removeTaskFromList(task.id, list.id);

      expect(backlog.tasks).toContain(task);
      expect(backlog.tasks).toHaveLength(1);
    });

    it('preserves membership in other lists', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');
      addList('Personal', 'Personal tasks');

      const task = backlog.tasks[0];
      const [work, personal] = lists;

      addTaskToList(task.id, work.id);
      addTaskToList(task.id, personal.id);
      removeTaskFromList(task.id, work.id);

      expect(task.lists).not.toContain(work.id);
      expect(task.lists).toContain(personal.id);
      expect(personal.tasks.some(item => item === task.id)).toBe(true);
    });

    it('does not remove other tasks from the list', () => {
      createTask({ title: 'Task A', description: '' });
      createTask({ title: 'Task B', description: '' });
      addList('Work', 'Work tasks');

      const [taskA, taskB] = backlog.tasks;
      const list = lists[0];

      addTaskToList(taskA.id, list.id);
      addTaskToList(taskB.id, list.id);
      removeTaskFromList(taskA.id, list.id);

      expect(list.tasks.some(item => item === taskA.id)).toBe(false);
      expect(list.tasks.some(item => item === taskB.id)).toBe(true);
      expect(backlog.tasks).toContain(taskA);
      expect(backlog.tasks).toContain(taskB);
    });

    it('does not fail when the task is not in the specified list', () => {
      createTask({ title: 'Task', description: '' });
      addList('Work', 'Work tasks');

      const task = backlog.tasks[0];
      const list = lists[0];

      expect(() => removeTaskFromList(task.id, list.id)).not.toThrow();

      expect(backlog.tasks).toContain(task);
      expect(task.lists).not.toContain(list.id);
    });
  });

  // -------------------------
  // BACKLOG INTEGRITY
  // -------------------------

  describe('Backlog integrity', () => {
    it('keeps the same task object in the backlog after editing multiple fields', () => {
      createTask({ title: 'Original', description: 'Original description' });
      const task = backlog.tasks[0];

      editTaskTitle(task.id, 'Updated');
      editTaskDescription(task.id, 'Updated description');
      editTaskPriority(task.id, priorityB);
      editTaskComplexity(task.id, complexityB);
      editTaskTimeEstimate(task.id, timeEstimateB);
      editTaskCompleted(task.id, true);

      expect(backlog.tasks).toHaveLength(1);
      expect(backlog.tasks[0]).toBe(task);
      expect(backlog.tasks[0].id).toBe(task.id);
    });

    it('does not create duplicate tasks when editing', () => {
      createTask({ title: 'Task A', description: '' });
      createTask({ title: 'Task B', description: '' });

      const [taskA, taskB] = backlog.tasks;

      editTaskTitle(taskA.id, 'Changed A');
      editTaskDescription(taskB.id, 'Changed B');
      editTaskCompleted(taskA.id, true);

      expect(backlog.tasks).toHaveLength(2);
      expect(backlog.tasks.filter(t => t.id === taskA.id)).toHaveLength(1);
      expect(backlog.tasks.filter(t => t.id === taskB.id)).toHaveLength(1);
    });

    it('does not change unrelated tasks when editing one task', () => {
      createTask({ title: 'Task A', description: 'A' });
      createTask({ title: 'Task B', description: 'B' });

      const [taskA, taskB] = backlog.tasks;

      editTaskTitle(taskA.id, 'Changed A');

      expect(taskA.title).toBe('Changed A');
      expect(taskB.title).toBe('Task B');
      expect(taskB.description).toBe('B');
      expect(backlog.tasks).toHaveLength(2);
    });
  });
});
