# ADR-0004: PostgreSQL als Datenbank, Prisma als ORM

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Benötigt wird eine relationale Datenbank für Benutzer, Rollen, Artikel, Versionen,
Organisationen und Audit-Daten (Fachkonzept §7) — mit Transaktionen über Modulgrenzen des
Monolithen, JSON-Unterstützung (Policies, Metadaten) und solider Self-Hosting-Story. Das ORM
muss Typensicherheit (NFR-040) und versionierte Migrationen (NFR-045) liefern.

## Entscheidung

**PostgreSQL 17** als einzige Systemdatenbank; **Prisma** als ORM mit `schema.prisma` als
deklarativer Schema-Quelle und Prisma Migrate für versionierte Migrationen
(→ [database/05](../../database/05-prisma-and-migrations.md)).

## Betrachtete Alternativen

- **MySQL/MariaDB** — abgelehnt: schwächere JSON-/CTE-/Volltext-Fähigkeiten, keine Vorteile.
- **MongoDB** — abgelehnt: stark relationale Domäne (Versionen, Rechte, Referenzen);
  Transaktionsanforderungen sprechen klar für SQL.
- **Drizzle/TypeORM/Knex** — abgelehnt: Prisma bietet die beste Kombination aus generierten
  Typen, Migrations-Workflow und Team-Ergonomie; Drizzle bleibt Beobachtungskandidat, ein
  Wechsel wäre ein neuer ADR.

## Konsequenzen

- ✅ Generierte Typen aus dem Schema; Migrationshistorie im Repo; eine Backup-Quelle.
- ✅ JSONB für ABAC-Bedingungen, Media-Varianten, Audit-Metadaten — ohne zweites Datensystem.
- ⚠️ Prisma-Client-Aufrufe bleiben in `infrastructure/`-Repositories (Regel B-1), damit ein
  ORM-Wechsel lokal bliebe.
- ⚠️ Komplexe Abfragen (Suche-Dokumentaufbau, Statistiken) dürfen `prisma.$queryRaw` mit
  parametrisierten Queries nutzen — dokumentationspflichtig im Repository-Code.
