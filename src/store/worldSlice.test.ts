import { describe, it, expect, vi } from 'vitest';
import { createWorldSlice } from './worldSlice';

describe('worldSlice', () => {
  it('should have a default displayName of null', () => {
    // @ts-ignore
    const slice = createWorldSlice(vi.fn(), vi.fn(), vi.fn());
    // @ts-ignore
    expect(slice.displayName).toBe(null);
  });

  it('setDisplayName should update the displayName state', () => {
    let state = { displayName: null };
    const set = vi.fn((val) => {
      const update = typeof val === 'function' ? val(state) : val;
      state = { ...state, ...update };
    });
    
    // @ts-ignore
    const slice = createWorldSlice(set, vi.fn(), vi.fn());
    // @ts-ignore
    slice.setDisplayName('New World');
    expect(state.displayName).toBe('New World');
  });
});
