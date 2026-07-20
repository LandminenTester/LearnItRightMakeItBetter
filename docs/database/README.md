# Database — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Datenhaltung der Plattform: **PostgreSQL 17** als einzige Systemdatenbank, **Prisma** als ORM
mit deklarativem Schema und versionierten Migrationen
(→ [ADR-0004](../architecture/decisions/adr-0004-postgresql-prisma.md)). Meilisearch-Indizes
und Redis-Inhalte sind abgeleiteter bzw. flüchtiger Zustand und hier nicht modelliert.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-data-model-overview.md](01-data-model-overview.md) | Gesamt-ERD, Domänenschnitt, verbindliche Modellierungskonventionen |
| [schemas/](schemas/README.md) | **Themenordner: Schema-Referenz pro Modul** (12 Dokumente — Tabellen, Spalten, Constraints, Indizes) |
| [05-prisma-and-migrations.md](05-prisma-and-migrations.md) | Prisma-Konventionen, Migrations-Workflow, Seeds |
| [06-data-lifecycle-gdpr.md](06-data-lifecycle-gdpr.md) | Datenlebenszyklus, Retention, DSGVO (Auskunft/Export/Löschung), Backups |

## Grundregeln (Kurzfassung)

- Schema-Änderungen **ausschließlich** über `schema.prisma` + generierte Migration im selben PR
  wie der nutzende Code (NFR-045).
- Jedes Modul liest/schreibt **nur seine eigenen Tabellen** (Regel B-1) — modulfremde Daten
  kommen über Ports/Events.
- Die Schema-Referenz in [schemas/](schemas/README.md) ist die fachliche Wahrheit; bei
  Abweichung zwischen Doku und `schema.prisma` gilt: Doku im selben PR nachziehen
  (→ [development-guidelines/04](../development-guidelines/04-documentation-standards.md)).
