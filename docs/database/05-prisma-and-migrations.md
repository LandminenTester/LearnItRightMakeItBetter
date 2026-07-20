# Prisma & Migrationen

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**ADR:** [ADR-0004](../architecture/decisions/adr-0004-postgresql-prisma.md)

## 1. Setup

- Schema: `apps/backend/prisma/schema.prisma` — **eine** Datei, gegliedert in kommentierte
  Modul-Blöcke (`// ─── Identity ───`), Reihenfolge wie [schemas/](schemas/README.md).
- Client-Generierung: `pnpm --filter backend prisma generate` (läuft in `postinstall` und CI).
- Prisma-Client-Zugriff ausschließlich über den `PrismaService` in `common/database`
  (Verbindungs-Pooling, Shutdown-Hooks, Transaktions-Helfer) — nie direkte
  `new PrismaClient()`-Instanzen in Modulen.

## 2. Migrations-Workflow

| Schritt | Kommando / Regel |
|---|---|
| Lokal entwickeln | `pnpm db:migrate:dev --name <beschreibung>` — erzeugt SQL-Migration + wendet sie an |
| Namenskonvention | `NNNN_<snake_case_beschreibung>` (Prisma-Zeitstempel + sprechender Name, z. B. `add_translation_source_version`) |
| Review | Migration-SQL ist Teil des PR-Diffs und wird wie Code reviewt (Lock-Verhalten! s. §3) |
| CI | Migrationen laufen gegen frische DB **und** gegen ein Seed-Bestandsabbild (Upgrade-Test, NFR-045) |
| Produktion | `prisma migrate deploy` als Init-Schritt vor App-Start (Compose: `migrate`-Service; K8s: Job/InitContainer → [deployment/03](../deployment/03-kubernetes.md)) |

**Regeln:**

- **MIG-1 (MUSS):** Migrationen sind **vorwärtsgerichtet**; kein `migrate reset` außerhalb
  lokaler Umgebungen; Down-Migrationen existieren nicht — Korrektur = neue Migration.
- **MIG-2 (MUSS):** Schema-Änderung und nutzender Code im **selben PR**; die Schema-Referenz
  ([schemas/](schemas/README.md)) wird mitgezogen.
- **MIG-3 (MUSS):** Zero-Downtime-Kompatibilität ab Phase 3 (K8s Rolling Updates, NFR-052):
  expand/contract-Muster — neue Spalten nullable/mit Default einführen, Code umstellen,
  Altspalten in späterem Release entfernen. Breaking-Reihenfolge im PR beschreiben.
- **MIG-4 (SOLLTE):** Datenmigrationen (Backfill) als eigene Migration mit Batch-Verarbeitung
  (keine Table-Locks über Minuten); große Backfills alternativ als idempotenter
  `maintenance`-Job mit Migrations-Flag.

## 3. Gefährliche Operationen (Review-Checkliste)

| Operation | Risiko | Vorgehen |
|---|---|---|
| `ALTER TABLE … ADD COLUMN NOT NULL` ohne Default | Full-Lock + Fehler bei Bestandsdaten | nullable einführen → Backfill → `SET NOT NULL` |
| Index auf großer Tabelle | Lock | `CREATE INDEX CONCURRENTLY` (Prisma: `-- @raw` in Migration, dokumentieren) |
| Enum-Wert entfernen | Bestandsdaten invalid | nie entfernen; nur ergänzen + App-seitig deprecaten |
| Spalte umbenennen | Prisma erzeugt DROP+ADD | manuell zu `ALTER … RENAME` editieren (Migration-SQL ist editierbar!) |

## 4. Seeds

- `prisma/seed.ts` mit klar getrennten Profilen:
  - **`base`** (immer, idempotent): Systemrollen + Permissions-Sync, Achievement-Definitionen,
    Default-`content_languages` (`en`, `de`), Settings-Defaults.
  - **`dev`** (nur lokal/CI): Testnutzer (`admin@local`, `maintainer@local`, `member@local`,
    Passwort dokumentiert in [development-guidelines/01](../development-guidelines/01-repository-structure.md)),
    Beispiel-Space mit Artikeln in mehreren Status, Beispiel-Org, Beispiel-Projekt.
  - **`e2e`** (Playwright): deterministische Fixtures (→ [testing/04](../testing/04-e2e-testing.md)).
- Seeds sind **idempotent** (upsert by key) — mehrfaches Ausführen ist sicher; `base`-Seed
  läuft auch in Produktion beim Deploy (Katalog-Sync A-2).

## 5. Raw SQL

`$queryRaw`/`$executeRaw` nur in `infrastructure/`-Repositories, **immer** parametrisiert
(Template-Tag), mit Kommentar warum ORM nicht reicht (ADR-0004). Verboten: String-Konkatenation
in SQL (→ [security/05](../security/05-application-security.md)).

## 6. Verbindungs-Management

- Pool-Größe über `DATABASE_POOL_SIZE` (Default 10 je API-/Worker-Prozess; Summe <
  `max_connections` beachten — Rechenhilfe im [Runbook](../deployment/runbooks/scaling.md)).
- Transaktionen kurz halten; keine externen Calls (HTTP, Storage) innerhalb von
  `$transaction` (Regel B-2-Ergänzung).
- `statement_timeout` 30 s app-seitig gesetzt; Langläufer gehören in Jobs.
