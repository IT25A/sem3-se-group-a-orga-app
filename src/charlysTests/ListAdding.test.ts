import { describe, it, expect, beforeEach } from 'vitest';
import { lists, addList } from '../taskAndListLogik';

describe('Adding lists', () => {
  beforeEach(() => {
    lists.length = 0;
  });

  it('adds a new list to the global lists array', () => {
    addList('Shopping', 'Einkaufen');

    expect(lists).toHaveLength(1);
    expect(lists[0].title).toBe('Shopping');
  });

  it('can add multiple lists', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');
    addList('Personal', 'Persönlich');

    expect(lists).toHaveLength(3);
    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Work',
      'Personal',
    ]);
  });

  it('preserves existing lists when adding another list', () => {
    addList('Shopping', 'Einkaufen');

    const firstList = lists[0];

    addList('Work', 'Arbeiten');

    expect(lists).toHaveLength(2);
    expect(lists[0]).toBe(firstList);
    expect(lists[1].title).toBe('Work');
  });

  it('creates lists with unique IDs', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    expect(lists[0].id).not.toBe(lists[1].id);
  });

  it('does not remove existing lists when adding a new list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    addList('Personal', 'Persönlich');

    expect(lists.map(list => list.title)).toContain('Shopping');
    expect(lists.map(list => list.title)).toContain('Work');
    expect(lists.map(list => list.title)).toContain('Personal');
  });
});