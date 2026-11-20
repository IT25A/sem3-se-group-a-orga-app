
import {
  describe,
  it,
  expect,
  beforeEach,
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
  addList,
  renameList,
  changeListDescription,
} from '../taskAndListLogik';

import {
  lists,
  updateAppData,
} from '../persistence/state';

// --------------------------------
// TESTS
// --------------------------------

describe('Editing lists', () => {

  beforeEach(() => {
    lists.length = 0;
    vi.clearAllMocks();
  });

  it('renames a list', async () => {
    await addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    await renameList(id, 'Groceries');

    expect(lists[0].title).toBe('Groceries');
  });

  it('changes a list description', async () => {
    await addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    await changeListDescription(id, 'Things to buy');

    expect(lists[0].description).toBe('Things to buy');
  });

  it('only renames the selected list', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    const shoppingId = lists[0].id;

    await renameList(shoppingId, 'Groceries');

    expect(lists.map(list => list.title)).toEqual([
      'Groceries',
      'Work',
    ]);
  });

  it('only changes the selected list description', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    const shoppingId = lists[0].id;

    await changeListDescription(shoppingId, 'Weekly shopping');

    expect(lists[0].description).toBe('Weekly shopping');
    expect(lists[1].description).not.toBe('Weekly shopping');
  });

  it('does nothing when renaming a nonexistent list', async () => {
    await addList('Shopping', 'Einkaufen');

    const originalTitle = lists[0].title;

    await renameList('nonexistent-id', 'Groceries');

    expect(lists[0].title).toBe(originalTitle);
  });

  it('does nothing when changing a nonexistent list description', async () => {
    await addList('Shopping', 'Einkaufen');

    const originalDescription = lists[0].description;

    await changeListDescription(
      'nonexistent-id',
      'New description'
    );

    expect(lists[0].description).toBe(originalDescription);
  });

  it('allows clearing a list description', async () => {
    await addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    await changeListDescription(id, 'Things to buy');
    await changeListDescription(id, '');

    expect(lists[0].description).toBe('');
  });

  it('calls updateAppData when renaming a list', async () => {
    await addList('Shopping', 'Einkaufen');

    vi.clearAllMocks();

    await renameList(lists[0].id, 'Groceries');

    expect(updateAppData).toHaveBeenCalledTimes(1);
  });

  it('calls updateAppData when changing a description', async () => {
    await addList('Shopping', 'Einkaufen');

    vi.clearAllMocks();

    await changeListDescription(
      lists[0].id,
      'New description'
    );

    expect(updateAppData).toHaveBeenCalledTimes(1);
  });

  it('does not call updateAppData when renaming a nonexistent list', async () => {
    await renameList('nonexistent-id', 'Groceries');

    expect(updateAppData).not.toHaveBeenCalled();
  });

  it('does not call updateAppData when changing a nonexistent list description', async () => {
    await changeListDescription(
      'nonexistent-id',
      'New description'
    );

    expect(updateAppData).not.toHaveBeenCalled();
  });
});
