import { beforeEach, describe, expect, it } from 'vitest';
import { backlog, createTask } from '../create';
import type { Priority, Complexity, TimeEstimate } from '../create';

describe('Task creation', () => {   
  beforeEach(() => {
    backlog.tasks.length = 0;
  });

  it('creates a task with the correct title', () => {
    createTask({
      title: 'Finish project',
      description: 'Complete the project documentation',
      dueDate: new Date('2026-11-01T12:00:00'),
      priority: 'high' as Priority,
      complexity: 'medium' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].title).toBe('Finish project');
  });

  it('creates a task with the correct description', () => {
    createTask({
      title: 'Finish project',
      description: 'Complete the documentation',
      dueDate: new Date('2026-11-01T12:00:00'),
      priority: 'high' as Priority,
      complexity: 'medium' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].description).toBe('Complete the documentation');
  });

  it('assigns a unique ID to each task', () => {
    createTask({
      title: 'Task A',
      description: '',
      dueDate: new Date('2026-11-01'),
      priority: 'high' as Priority,
      complexity: 'low' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    createTask({
      title: 'Task B',
      description: '',
      dueDate: new Date('2026-11-02'),
      priority: 'low' as Priority,
      complexity: 'high' as Complexity,
      timeEstimate: 'lang' as TimeEstimate,
    });

    expect(backlog.tasks[0].id).not.toBe(backlog.tasks[1].id);
  });

  it('sets createdAt to a valid date', () => {
    createTask({
      title: 'Test task',
      description: '',
      dueDate: new Date('2026-11-01'),
      priority: 'medium' as Priority,
      complexity: 'medium' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(backlog.tasks[0].createdAt.getTime())).toBe(false);
  });

  it('stores the due date correctly', () => {
    const dueDate = new Date('2026-11-01T12:00:00');

    createTask({
      title: 'Test task',
      description: '',
      dueDate,
      priority: 'medium' as Priority,
      complexity: 'medium' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].dueDate).toEqual(dueDate);
  });

  it('stores priority, complexity, and time estimate correctly', () => {
    createTask({
      title: 'Test task',
      description: '',
      dueDate: new Date('2026-11-01'),
      priority: 'high' as Priority,
      complexity: 'high' as Complexity,
      timeEstimate: 'lang' as TimeEstimate,
    });

    expect(backlog.tasks[0].priority).toBe('high');
    expect(backlog.tasks[0].complexity).toBe('high');
    expect(backlog.tasks[0].timeEstimate).toBe('lang');
  });

  it('sets completed to false for a new task', () => {
    createTask({
      title: 'Test task',
      description: '',
      dueDate: new Date('2026-11-01'),
      priority: 'medium' as Priority,
      complexity: 'low' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].completed).toBe(false);
  });

  it('adds multiple tasks to the global tasks array', () => {
    createTask({
      title: 'Task A',
      description: '',
      dueDate: new Date('2026-11-01'),
      priority: 'low' as Priority,
      complexity: 'low' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    createTask({
      title: 'Task B',
      description: '',
      dueDate: new Date('2026-11-02'),
      priority: 'high' as Priority,
      complexity: 'high' as Complexity,
      timeEstimate: 'lang' as TimeEstimate,
    });

    expect(backlog.tasks).toHaveLength(2);
    expect(backlog.tasks.map(task => task.title)).toEqual(['Task A', 'Task B']);
  });
});

describe('Task creation with optional attributes', () => {
  beforeEach(() => {
    backlog.tasks.length = 0;
  });

  it('creates a task with only title and description', () => {
    createTask({
      title: 'Buy groceries',
      description: 'Buy milk and bread',
    });

    expect(backlog.tasks).toHaveLength(1);
    expect(backlog.tasks[0].title).toBe('Buy groceries');
    expect(backlog.tasks[0].description).toBe('Buy milk and bread');
  });

  it('allows the due date to be omitted', () => {
    createTask({
      title: 'Read a book',
      description: 'Read chapter one',
    });

    expect(backlog.tasks[0].dueDate).toBeUndefined();
  });

  it('allows priority, complexity, and time estimate to be omitted', () => {
    createTask({
      title: 'Clean desk',
      description: 'Organize the workspace',
    });

    expect(backlog.tasks[0].priority).toBe('mittel');
    expect(backlog.tasks[0].complexity).toBe('mittel');
    expect(backlog.tasks[0].timeEstimate).toBe('mittel');
  });

  it('preserves optional attributes when provided', () => {
    const dueDate = new Date('2026-11-01T12:00:00');

    createTask({
      title: 'Finish project',
      description: 'Complete documentation',
      dueDate,
      priority: 'high' as Priority,
      complexity: 'medium' as Complexity,
      timeEstimate: 'kurz' as TimeEstimate,
    });

    expect(backlog.tasks[0].dueDate).toEqual(dueDate);
    expect(backlog.tasks[0].priority).toBe('high');
    expect(backlog.tasks[0].complexity).toBe('medium');
    expect(backlog.tasks[0].timeEstimate).toBe('kurz');
  });
});
