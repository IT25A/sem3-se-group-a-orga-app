
import {
  beforeEach,
  describe,
  expect,
  it,
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
  deleteListsRecursivly,
} from '../taskAndListLogik';

import {
  lists,
  backlog,
  updateAppData,
} from '../persistence/state';

// --------------------------------
// TESTS
// --------------------------------

describe('deleteListsRecursivly', () => {

  beforeEach(() => {
    backlog.tasks.length = 0;
    lists.length = 0;
    vi.clearAllMocks();
  });

  it('handles task IDs that are missing from the backlog', async () => {
    await addList('Work', 'Tasks related to work');

    const work = lists[0];

    work.tasks.push('nonexistent-task');

    await expect(
      deleteListsRecursivly(work.id)
    ).resolves.toBeUndefined();

    expect(lists).not.toContain(work);
  });

  it('deletes all tasks belonging to the specified list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await addList('Work', 'Tasks related to work');

    const [taskA, taskB] = backlog.tasks;
    const work = lists[0];

    await addTaskToList(taskA.id, work.id);
    await addTaskToList(taskB.id, work.id);

    await deleteListsRecursivly(work.id);

    expect(backlog.tasks).toHaveLength(0);
    expect(work.tasks).toHaveLength(0);
  });

  it('removes deleted tasks from the backlog', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const work = lists[0];

    await addTaskToList(task.id, work.id);
    await deleteListsRecursivly(work.id);

    expect(backlog.tasks).not.toContain(task);
  });

  it('preserves tasks that do not belong to the specified list', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await addList('Work', 'Tasks related to work');

    const [taskA, taskB] = backlog.tasks;
    const work = lists[0];

    await addTaskToList(taskA.id, work.id);

    await deleteListsRecursivly(work.id);

    expect(backlog.tasks).toContain(taskB);
    expect(backlog.tasks).toHaveLength(1);
  });

  it('does delete the list itself', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const work = lists[0];

    await addTaskToList(backlog.tasks[0].id, work.id);
    await deleteListsRecursivly(work.id);

    expect(lists).not.toContain(work);
    expect(lists).toHaveLength(0);
  });

  it('handles an empty list', async () => {
    await addList('Empty', 'An empty list');

    const empty = lists[0];

    await expect(
      deleteListsRecursivly(empty.id)
    ).resolves.toBeUndefined();

    expect(lists).not.toContain(empty);
    expect(backlog.tasks).toHaveLength(0);
  });

  it('does nothing when the list does not exist', async () => {
    await createTask({ title: 'Task A', description: '' });
    await addList('Work', 'Tasks related to work');

    const task = backlog.tasks[0];
    const work = lists[0];

    await addTaskToList(task.id, work.id);

    await expect(
      deleteListsRecursivly('nonexistent-list')
    ).resolves.toBeUndefined();

    expect(backlog.tasks).toContain(task);
    expect(work.tasks).toContain(task.id);
    expect(task.lists).toContain(work.id);
  });

  it('deletes only tasks that belong exclusively to the specified list and the backlog', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });
    await createTask({ title: 'Task C', description: '' });

    await addList('Work', 'Tasks related to work');
    await addList('Personal', 'Personal tasks');

    const [taskA, taskB, taskC] = backlog.tasks;
    const [work, personal] = lists;

    await addTaskToList(taskA.id, work.id);
    await addTaskToList(taskA.id, personal.id);

    await addTaskToList(taskB.id, personal.id);

    await addTaskToList(taskC.id, work.id);

    await deleteListsRecursivly(work.id);

    expect(backlog.tasks).toContain(taskA);
    expect(personal.tasks).toContain(taskA.id);
    expect(taskA.lists).toContain(personal.id);
    expect(taskA.lists).not.toContain(work.id);

    expect(backlog.tasks).toContain(taskB);
    expect(personal.tasks).toContain(taskB.id);

    expect(backlog.tasks).not.toContain(taskC);

    expect(lists).not.toContain(work);
    expect(lists).toContain(personal);
  });

  it('preserves unrelated lists and their tasks', async () => {
    await createTask({ title: 'Task A', description: '' });
    await createTask({ title: 'Task B', description: '' });

    await addList('Work', 'Tasks related to work');
    await addList('Personal', 'Personal tasks');

    const [taskA, taskB] = backlog.tasks;
    const [work, personal] = lists;

    await addTaskToList(taskA.id, work.id);
    await addTaskToList(taskB.id, personal.id);

    await deleteListsRecursivly(work.id);

    expect(lists).toContain(personal);
    expect(personal.tasks).toContain(taskB.id);
    expect(backlog.tasks).toContain(taskB);
  });

  it('calls updateAppData when deleting a list', async () => {
    await addList('Work', 'Tasks related to work');

    vi.clearAllMocks();

    await deleteListsRecursivly(lists[0].id);

    expect(updateAppData).toHaveBeenCalled();
  });
});
