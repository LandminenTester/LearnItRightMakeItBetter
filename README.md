# Learn it right. Make it better.

> Modular Open Knowledge, Developer Community & Enterprise Infrastructure Platform —
> offen, modular, vollständig selbst hostbar. **Eine Codebasis. Eine Plattform.
> Unbegrenzte Möglichkeiten.**

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
Lizenz: [AGPL-3.0-only](LICENSE) · Inhalte der Plattform: CC BY-SA 4.0

## Was ist das?

Eine Wissensplattform für Entwickler, Communities, Open-Source-Projekte und Unternehmen:
geprüfte Artikel mit Versionierung und Review-Workflow, Community-Übersetzungen,
Entwicklerprofile mit Reputation, Organisationen, GitHub-Projektintegration, Enterprise-IAM
(OIDC/SSO, RBAC + ABAC, Audit) — konfigurierbar statt in Editionen gespalten.

**Die vollständige Spezifikation lebt in [`docs/`](docs/README.md)** — Anforderungen,
Architektur, Modul-Spezifikationen, Datenmodell, API, Security, Design System, Deployment,
Testing und Arbeitsrichtlinien. Sie ist die verbindliche Grundlage der Entwicklung.

## Techstack

Nuxt 3 · Vue 3 · TypeScript · Tailwind CSS 4 · NestJS · PostgreSQL 17 + Prisma ·
Redis 7 + BullMQ · Meilisearch · pnpm + Turborepo — Begründungen:
[ADRs](docs/architecture/decisions/README.md).

## Quickstart (lokale Entwicklung)

Voraussetzungen: Node ≥ 22, pnpm ≥ 11 (`corepack enable`), Docker.

```bash
pnpm install          # Workspace-Abhängigkeiten
pnpm infra:up         # PostgreSQL, Redis, Meilisearch, MinIO, Mailhog (Docker)
pnpm db:migrate:dev   # Prisma-Migrationen (sobald erste Modelle existieren)
pnpm db:seed          # Basis- und Dev-Seeds
pnpm dev              # Frontend (3000) + Backend (3001) mit HMR
```

Qualität vor jedem PR: `pnpm verify` (Lint + Typecheck + Tests + Build).
Alle Kommandos: [docs/development-guidelines/01](docs/development-guidelines/01-repository-structure.md).

## Repository-Aufbau

| Pfad | Inhalt |
|---|---|
| `apps/frontend` | Nuxt-3-App (SSR öffentlich, SPA für App/Admin/Setup) |
| `apps/backend` | NestJS — modularer Monolith mit 12 Fachmodulen, Prisma, Worker, CLI |
| `packages/design-system` | Tokens + `Lir*`-Komponenten — einzige UI-Quelle |
| `packages/shared-types` | Zod-Schemas, Enums, Error-Codes, Permission-Katalog |
| `infrastructure/` | Docker (Dev/Prod-Compose, Dockerfiles), Kubernetes-Basis |
| `tests/` | Playwright-E2E, k6-Lastprofile |
| `docs/` | **Master Requirements Repository** (Spezifikation) |

## Projektstand

Phase 0 „Foundation" gemäß [Roadmap](docs/requirements/06-roadmap-milestones.md):
Monorepo, Tooling, CI, Modul-Skelette und Dev-Umgebung stehen — die Fachmodule werden
entlang der [Epics](docs/requirements/epics/README.md) implementiert.

## Mitmachen & Sicherheit

Arbeitsweise: [docs/development-guidelines/](docs/development-guidelines/README.md)
(inkl. [Definition of Done](docs/development-guidelines/06-definition-of-done.md)).
Sicherheitslücken bitte gemäß [SECURITY.md](SECURITY.md) melden — nicht als öffentliches Issue.
