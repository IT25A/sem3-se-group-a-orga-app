import { describe, it, expect, beforeEach } from 'vitest';
import {
  lists,
  addList,
  renameList,
  changeListDescription,
} from '../taskAndListLogik';

describe('Editing lists', () => {
  beforeEach(() => {
    lists.length = 0;
  });

  it('renames a list', () => {
    addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    renameList(id, 'Groceries');

    expect(lists[0].title).toBe('Groceries');
  });

  it('changes a list description', () => {
    addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    changeListDescription(id, 'Things to buy');

    expect(lists[0].description).toBe('Things to buy');
  });

  it('only renames the selected list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    const shoppingId = lists[0].id;

    renameList(shoppingId, 'Groceries');

    expect(lists.map(list => list.title)).toEqual([
      'Groceries',
      'Work',
    ]);
  });

  it('only changes the selected list description', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    const shoppingId = lists[0].id;

    changeListDescription(shoppingId, 'Weekly shopping');

    expect(lists[0].description).toBe('Weekly shopping');
    expect(lists[1].description).not.toBe('Weekly shopping');
  });

  it('does nothing when renaming a nonexistent list', () => {
    addList('Shopping', 'Einkaufen');

    renameList('nonexistent-id', 'Groceries');

    expect(lists[0].title).toBe('Shopping');
  });

  it('does nothing when changing a nonexistent list description', () => {
    addList('Shopping', 'Einkaufen');

    changeListDescription('nonexistent-id', 'New description');

    expect(lists[0].description).not.toBe('New description');
  });

  it('allows clearing a list description', () => {
    addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    changeListDescription(id, 'Things to buy');
    changeListDescription(id, '');

    expect(lists[0].description).toBe('');
  });
});