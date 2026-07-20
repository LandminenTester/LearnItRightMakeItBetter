# ADR-0010: Monorepo mit pnpm workspaces + Turborepo

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Das Fachkonzept (§19) definiert eine Repository-Struktur mit `/apps` (frontend, backend),
`/packages` (design-system, shared-types), `/services/workers`, `/infrastructure`, `/docs`,
`/tests`. Frontend und Backend teilen Typen (API-Contracts, Zod-Schemas) und das Design System —
enge Kopplung der Artefakte bei getrennten Deployables.

## Entscheidung

**Ein Monorepo** mit **pnpm workspaces** (Paketverwaltung, strikte Hoisting-Regeln) und
**Turborepo** (Task-Orchestrierung, Remote-/Local-Caching für `build`, `lint`, `test`,
`typecheck`). Struktur → [development-guidelines/01](../../development-guidelines/01-repository-structure.md).
Versionierung: ein gemeinsames Release (Plattform-Version), keine unabhängigen Paket-Releases.

## Betrachtete Alternativen

- **Polyrepo (frontend/backend/design-system getrennt)** — abgelehnt: Shared Types und
  Design-System-Änderungen würden zu Versions-Ping-Pong über Repos; atomare Änderungen
  (API-Contract + beide Seiten) unmöglich in einem PR.
- **Nx statt Turborepo** — gleichwertig mächtig, aber mehr Framework-Eigenleben; Turborepo ist
  der kleinere Eingriff. Wechsel wäre ein neuer ADR.
- **npm/yarn workspaces** — pnpm ist strikter (Phantom Dependencies) und schneller.

## Konsequenzen

- ✅ Ein PR ändert Contract + Backend + Frontend + Doku atomar; CI cached pro Paket.
- ✅ `packages/shared-types` erzwingt einen einzigen Ort für API-Typen (Regel im
  [OpenAPI-Workflow](../../api/05-openapi-workflow.md)).
- ⚠️ CI muss Task-Graph nutzen (nur Betroffenes bauen), sonst wächst die Pipeline-Dauer mit dem
  Repo (→ [testing/05](../../testing/05-quality-gates-performance.md)).
- ⚠️ Workspace-Disziplin: `apps/*` importieren aus `packages/*`, nie umgekehrt; Pakete
  deklarieren Abhängigkeiten explizit.
