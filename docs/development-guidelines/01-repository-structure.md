# Repository-Struktur (Monorepo)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**ADR:** [ADR-0010](../architecture/decisions/adr-0010-monorepo-pnpm-turborepo.md) · Fachkonzept §19

## 1. Verzeichnisbaum

```
learn-it-right/
├── apps/
│   ├── frontend/                 -- Nuxt 3 (Struktur → architecture/03)
│   └── backend/                  -- NestJS + Prisma + CLI (Struktur → architecture/04)
├── packages/
│   ├── design-system/            -- tokens/ components/ layouts/ patterns/ documentation/
│   └── shared-types/             -- Zod-Schemas (API-DTOs, Events, Settings-Registry,
│                                    Permission-Katalog, Error-Codes), generierter API-Client
├── services/
│   └── workers/                  -- Worker-Deployment-Belange (Prozess-Configs, queue-
│                                    spezifische Skalierungs-Profile); Code liegt im Backend
├── infrastructure/
│   ├── docker/                   -- Dockerfiles, compose.{dev,prod,e2e}.yml, .env-Beispiele
│   └── kubernetes/               -- Kustomize-Basis + Overlays (Helm ab Phase 3)
├── docs/                         -- dieses Requirements-Repository
├── tests/
│   ├── e2e/                      -- Playwright (Suiten → testing/04, Kataloge → testing/scenarios)
│   └── load/                     -- k6-Profile + Datengenerator (testing/05)
├── .github/                      -- Workflows (CI-Blöcke → testing/05 §1), Issue-/PR-Templates
├── turbo.json · pnpm-workspace.yaml · package.json
└── LICENSE (AGPLv3) · SECURITY.md · README.md
```

**Workspace-Regeln:** `apps/*` importieren aus `packages/*`, nie umgekehrt und nie
untereinander; `tests/*` darf beide nutzen. Abhängigkeiten stets explizit im jeweiligen
`package.json` (pnpm verhindert Phantom-Imports).

## 2. Zentrale Kommandos (Root-`package.json`)

| Kommando | Wirkung |
|---|---|
| `pnpm setup:dev` | Install + `infra:up` + Migrationen + `dev`-Seed — ein Befehl bis zur laufenden Umgebung |
| `pnpm infra:up` / `infra:down` | Dev-Compose-Stack (PG, Redis, Meili, MinIO, Mailhog) |
| `pnpm dev` | Frontend + Backend + Worker parallel (turbo) mit HMR |
| `pnpm db:migrate:dev` / `db:seed` / `db:studio` | Prisma-Workflows ([database/05](../database/05-prisma-and-migrations.md)) |
| `pnpm gen:api` | OpenAPI → typisierter Client ([api/05](../api/05-openapi-workflow.md)) |
| `pnpm verify` | **lint + typecheck + test:unit + build** — Pflicht vor jedem PR |
| `pnpm test:int` / `e2e` / `e2e --ui` | Integrations-/E2E-Suiten |
| `pnpm story` | Histoire des Design Systems |

## 3. Dev-Zugangsdaten (`dev`-Seed — nur lokal!)

| Konto | Rolle |
|---|---|
| `admin@local` / `local-dev-password` | platform.admin (MFA aus) |
| `maintainer@local`, `reviewer@local`, `translator@local`, `member@local` (gleiches Passwort) | jeweilige Rollen im Beispiel-Space/`de` |

Seed erzeugt zusätzlich: Beispiel-Space mit Artikeln in allen Status, private Beispiel-Org,
Beispiel-Projekt mit Fake-Sync-Daten. Diese Konten existieren ausschließlich im
`dev`-Profil ([database/05 §4](../database/05-prisma-and-migrations.md)) — niemals in
Produktion.

## 4. Wo lebt was? (Schnellreferenz)

| Ich will … | Ort |
|---|---|
| einen API-Endpunkt ergänzen | `apps/backend/src/modules/<modul>/api` + Schema in `packages/shared-types` + Doku [api/endpoints](../api/endpoints/README.md) |
| eine Fachregel ändern | erst Service-Doku ([services/](../services/README.md)), dann `application`/`domain` des Moduls |
| eine UI-Komponente | `packages/design-system` ([Regeln](../design-system/06-agentic-ui-rules.md)) |
| eine Migration | `pnpm db:migrate:dev` + Schema-Referenz ([database/schemas](../database/schemas/README.md)) |
| einen Hintergrundjob | Modul-`infrastructure` + Queue-Registry (`common/jobs`) + Service-Doku §6 |
| ENV-Variable | `common/config` + [deployment/04](../deployment/04-configuration-reference.md) + `.env.example` |
