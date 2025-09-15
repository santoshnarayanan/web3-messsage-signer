import { describe, it, expect } from 'vitest';
import { loadHistory, saveHistory } from './history';

describe('history storage', () => {
  it('saves and loads', () => {
    const sample = [{ id: '1', message: 'm', signature: '0xabc', isValid: true, signer: '0x0', at: Date.now() }];
    saveHistory(sample as any);
    const loaded = loadHistory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].signature).toBe('0xabc');
  });
});
