import { describe, expect, it } from 'vitest';
import { PERMISSION_CATALOG, PERMISSION_KEY_PATTERN } from './permission-catalog';

// Regel A-1/A-2 (docs/services/authorization-service.md): Konvention und Eindeutigkeit
// des Katalogs sind maschinell abgesichert.
describe('Permission-Katalog', () => {
  it('A-1: jeder Key folgt dem Schema <modul>.<ressource>.<aktion> mit erlaubtem Verb', () => {
    for (const permission of PERMISSION_CATALOG) {
      expect(permission.key, permission.key).toMatch(PERMISSION_KEY_PATTERN);
    }
  });

  it('A-2: Keys sind eindeutig', () => {
    const keys = PERMISSION_CATALOG.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('A-1: das Modul-Segment entspricht dem deklarierten Modul', () => {
    for (const permission of PERMISSION_CATALOG) {
      expect(permission.key.split('.')[0]).toBe(permission.module);
    }
  });

  it('jede Permission trägt eine Beschreibung für die Admin-UI', () => {
    for (const permission of PERMISSION_CATALOG) {
      expect(permission.description.length).toBeGreaterThan(5);
    }
  });
});
