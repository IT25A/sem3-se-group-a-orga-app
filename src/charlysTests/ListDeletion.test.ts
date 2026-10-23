import { describe, it, expect, beforeEach } from 'vitest';
import { lists, addList, deleteList } from '../create';

describe('Deleting lists', () => {
  beforeEach(() => {
    lists.length = 0;
  });

  it('removes a list from the global lists array', () => {
    addList('Shopping', 'Einkaufen');
    const id = lists[0].id;

    deleteList(id);

    expect(lists).toHaveLength(0);
  });

  it('deletes only the selected list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');
    addList('Personal', 'Persönlich');

    const idToDelete = lists[1].id;

    deleteList(idToDelete);

    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Personal',
    ]);
  });

  it('preserves the order of the remaining lists', () => {
    addList('A', 'Beschreibung A');
    addList('B', 'Beschreibung B');
    addList('C', 'Beschreibung C');
    addList('D', 'Beschreibung D');

    deleteList(lists[1].id);

    expect(lists.map(list => list.title)).toEqual([
      'A',
      'C',
      'D',
    ]);
  });

  it('does nothing if the list does not exist', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    deleteList('nonexistent-id');

    expect(lists.map(list => list.title)).toEqual([
      'Shopping',
      'Work',
    ]);
  });

  it('does not throw an error when deleting from an empty array', () => {
    expect(() => deleteList('nonexistent-id')).not.toThrow();
    expect(lists).toHaveLength(0);
  });

  it('can delete the last remaining list', () => {
    addList('Shopping', 'Einkaufen');
    addList('Work', 'Arbeiten');

    deleteList(lists[0].id);
    deleteList(lists[0].id);

    expect(lists).toHaveLength(0);
  });
});