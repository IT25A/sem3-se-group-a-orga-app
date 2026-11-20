
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock muss vor dem Import der zu testenden Datei stehen
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

import { addList } from '../taskAndListLogik';
import { lists, updateAppData } from '../persistence/state';

describe('Adding lists', () => {
  beforeEach(() => {
    lists.length = 0;
    vi.clearAllMocks();
  });

  it('adds a new list to the global lists array', async () => {
    await addList('Shopping', 'Einkaufen');

    expect(lists).toHaveLength(1);
    expect(lists[0].title).toBe('Shopping');
    expect(lists[0].description).toBe('Einkaufen');
  });

  it('can add multiple lists', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');
    await addList('Personal', 'Persönlich');

    expect(lists).toHaveLength(3);
    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Work',
      'Personal',
    ]);
  });

  it('preserves existing lists when adding another list', async () => {
    await addList('Shopping', 'Einkaufen');

    const firstList = lists[0];

    await addList('Work', 'Arbeiten');

    expect(lists).toHaveLength(2);
    expect(lists[0]).toBe(firstList);
    expect(lists[1].title).toBe('Work');
  });

  it('creates lists with unique IDs', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    expect(lists[0].id).not.toBe(lists[1].id);
  });

  it('does not remove existing lists when adding a new list', async () => {
    await addList('Shopping', 'Einkaufen');
    await addList('Work', 'Arbeiten');

    await addList('Personal', 'Persönlich');

    expect(lists.map(list => list.title)).toContain('Shopping');
    expect(lists.map(list => list.title)).toContain('Work');
    expect(lists.map(list => list.title)).toContain('Personal');
  });

  it('calls updateAppData after adding a list', async () => {
    await addList('Shopping', 'Einkaufen');

    expect(updateAppData).toHaveBeenCalledTimes(1);
  });
});
