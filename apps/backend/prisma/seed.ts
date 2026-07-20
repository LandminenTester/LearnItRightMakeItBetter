/**
 * Seed-Einstieg mit Profilen `base` | `dev` | `e2e`
 * (docs/database/05-prisma-and-migrations.md §4). Seeds sind idempotent (upsert by key).
 *
 * base: Systemrollen + Permission-Sync, Achievements, Default-Sprachen, Settings-Defaults
 * dev:  Testkonten + Beispiel-Space/-Org/-Projekt (nur lokal!)
 * e2e:  deterministische Playwright-Fixtures
 */
const profile = process.env.SEED_PROFILE ?? 'base';

async function main(): Promise<void> {
  // TODO(Phase 1): base-Seed implementieren, sobald die ersten Prisma-Modelle existieren
  // (Permission-Katalog aus @lir/shared-types → DB-Sync gemäß Regel A-2).
  console.log(
    `[seed] Profil "${profile}" — Implementierung folgt mit den ersten Modellen (E-02/E-03).`,
  );
}

main().catch((error) => {
  console.error('[seed] fehlgeschlagen:', error);
  process.exit(1);
});
