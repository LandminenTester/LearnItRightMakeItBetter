import { describe, expect, it } from 'vitest';
import de from '../../i18n/locales/de.json';
import en from '../../i18n/locales/en.json';

// NFR-033 / docs/design-system/05 §4: de und en müssen key-paritätisch sein —
// fehlende Übersetzungen fallen im CI auf, nicht beim Nutzer (US-14-04).
function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('UI-i18n Key-Parität (de/en)', () => {
  it('beide Locales enthalten exakt dieselben Keys', () => {
    const deKeys = flattenKeys(de).sort();
    const enKeys = flattenKeys(en).sort();
    expect(deKeys).toEqual(enKeys);
  });

  it('kein Key hat einen leeren Wert', () => {
    const check = (value: unknown, path: string): void => {
      if (typeof value === 'string') {
        expect(value.trim().length, path).toBeGreaterThan(0);
        return;
      }
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        check(child, `${path}.${key}`);
      }
    };
    check(de, 'de');
    check(en, 'en');
  });
});
