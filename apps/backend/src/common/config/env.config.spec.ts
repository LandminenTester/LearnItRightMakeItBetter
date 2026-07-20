import { describe, expect, it } from 'vitest';
import { loadEnv } from './env.config';

describe('loadEnv', () => {
  it('liefert sichere Defaults für die lokale Entwicklung', () => {
    const env = loadEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
    expect(env.WORKER).toBe(false);
    expect(env.STORAGE_DRIVER).toBe('filesystem');
  });

  it('parst WORKER und Zahlen korrekt', () => {
    const env = loadEnv({ WORKER: 'true', PORT: '4000', DATABASE_POOL_SIZE: '5' });
    expect(env.WORKER).toBe(true);
    expect(env.PORT).toBe(4000);
    expect(env.DATABASE_POOL_SIZE).toBe(5);
  });

  it('scheitert fail-fast mit verständlicher Meldung bei ungültigen Werten', () => {
    expect(() => loadEnv({ APP_URL: 'kein-url' })).toThrowError(/APP_URL/);
    expect(() => loadEnv({ PORT: '-1' })).toThrowError(/PORT/);
  });
});
