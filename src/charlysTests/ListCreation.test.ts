import { describe, it, expect } from 'vitest';
import { createList } from '../create';

describe('createList', () => {
  it('creates a list with the given title', () => {
    const list = createList('Shopping', 'Einkaufen');

    expect(list.title).toBe('Shopping');
  });

  it('assigns an ID to the new list', () => {
    const list = createList('Shopping', 'Einkaufen');

    expect(list.id).toBeDefined();
  });

  it('assigns a unique ID to each list', () => {
    const first = createList('Shopping', 'Einkaufen');
    const second = createList('Work', 'Arbeiten');

    expect(first.id).not.toBe(second.id);
  });
});