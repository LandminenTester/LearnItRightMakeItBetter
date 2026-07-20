# Backend-Architektur (NestJS)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Überblick

Das Backend (`apps/backend`) ist eine NestJS-Anwendung (Node.js 22 LTS, TypeScript strict) und
bildet den modularen Monolithen aus [02-module-boundaries.md](02-module-boundaries.md) ab.
Gewählt wegen Enterprise-Architektur, Modulsystem, Dependency Injection, Security-Konzepten und
durchgehender TypeScript-Unterstützung (→ [ADR-0003](decisions/adr-0003-nestjs-backend.md)).

## 2. Verzeichnisstruktur `apps/backend/`

```
apps/backend/
├── src/
│   ├── main.ts                  -- Bootstrap API-Modus
│   ├── worker.ts                -- Bootstrap Worker-Modus (gleiche Module, nur Prozessoren)
│   ├── cli/                     -- CLI-Einstiege (Recovery, Reindex, Migrationen) via nest-commander
│   ├── app.module.ts
│   ├── common/                  -- Querschnitt OHNE Fachlogik (Regel M-7):
│   │   ├── auth/                --   SessionGuard, PermissionGuard, Decorators (@RequirePermission)
│   │   ├── config/              --   typisiertes Config-Loading (ENV, Zod-validiert)
│   │   ├── crypto/              --   Feldverschlüsselung (AES-256-GCM), Hashing-Helfer
│   │   ├── database/            --   PrismaService, Transaktions-Helfer
│   │   ├── events/              --   EventBus-Wrapper (EventEmitter2), Event-Basistypen
│   │   ├── http/                --   ExceptionFilter (Problem Details), Interceptors, Pagination
│   │   ├── jobs/                --   BullMQ-Basisklassen, Queue-Registry
│   │   ├── logging/             --   strukturierter Logger (pino), Request-Kontext (AsyncLocalStorage)
│   │   ├── rate-limit/          --   Redis-Rate-Limiter
│   │   └── redis/               --   RedisService
│   └── modules/
│       ├── identity/ … configuration/   -- die 12 Module (Anatomie → 02-module-boundaries.md §2)
├── prisma/
│   ├── schema.prisma            -- gesamtes Schema (modulweise kommentierte Blöcke)
│   └── migrations/
└── test/
```

## 3. Schichten innerhalb eines Moduls

```
api/            Controller: HTTP-Details, DTO-Validierung (Zod), OpenAPI-Dekoration.
                KEINE Fachlogik, KEIN Prisma.
application/    Use-Case-Services: Orchestrierung, Transaktionsgrenzen, AuthZ-Feinprüfung,
                Event-Publikation. Öffentliche Schnittstelle des Moduls.
domain/         Entitäten/Value Objects/Fachregeln/Domain-Event-Klassen. Framework-frei,
                importiert weder NestJS-HTTP noch Prisma.
infrastructure/ Prisma-Repositories (einzige DB-Zugriffe des Moduls), externe Clients,
                Adapter-Implementierungen.
```

**Regeln:**

- **B-1 (MUSS):** Prisma-Aufrufe nur in `infrastructure/`-Repositories des eigenen Moduls.
  Kein Modul liest fremde Tabellen (auch nicht „nur lesend") — dafür gibt es Ports/Events.
- **B-2 (MUSS):** Jeder Use-Case-Service definiert seine Transaktionsgrenze explizit
  (`prisma.$transaction`); Domain Events werden erst nach Commit publiziert (Regel M-5).
- **B-3 (MUSS):** Eingabevalidierung ausschließlich über Zod-Schemas aus
  `packages/shared-types` am Controller-Rand; Services erhalten bereits validierte, typisierte
  Daten. Wertebereichs- und Konsistenzprüfungen der Fachlogik gehören zusätzlich in die Services
  (Client-Daten sind nie vertrauenswürdig).
- **B-4 (MUSS):** Fehler als typisierte Domain-Exceptions (`ArticleNotFoundError`,
  `PermissionDeniedError`, …); der globale ExceptionFilter mappt auf Problem Details
  (→ [api/01](../api/01-api-conventions.md)). Keine nackten `throw new Error()` in Fachcode.

## 4. Request-Pipeline

```
Request
  → Middleware: RequestId, Logger-Kontext, Cookie-Parsing
  → Guards: SessionGuard (AuthN) → ModuleEnabledGuard → PermissionGuard (@RequirePermission)
  → Rate-Limit-Interceptor (endpoint-spezifische Limits)
  → Zod-Validation (DTO)
  → Controller → Application Service → (Domain, Infrastructure)
  → Response-Interceptor (Envelope, Caching-Header)
  → ExceptionFilter (Problem Details, Audit bei Security-Fehlern)
```

`@RequirePermission('knowledge.article.publish', { scope: 'space' })` deklariert die nötige
Permission deklarativ am Handler; Endpunkte ohne Deklaration und ohne explizites `@Public()`
werden beim Bootstrap **abgelehnt** (Startup-Check, Deny-by-default, FR-AUTZ-008).

## 5. Konfiguration

- ENV-Variablen werden beim Start per Zod validiert (fail-fast mit klarer Fehlermeldung);
  Katalog → [deployment/04](../deployment/04-configuration-reference.md).
- Fachliche Laufzeit-Einstellungen liefert das `configuration`-Modul (DB-gestützt, gecacht,
  Präzedenz ENV > DB, FR-CONF-006).
- Secrets in DB-Settings verschlüsselt die `common/crypto`-Schicht mit `APP_ENCRYPTION_KEY`
  (→ [security/04](../security/04-data-protection-privacy.md)).

## 6. Hintergrundjobs (BullMQ)

| Queue | Jobs (Beispiele) | Besonderheiten |
|---|---|---|
| `mail` | `send-mail` | Retry 5×, exponentiell; Templates im Notification-Modul |
| `search-index` | `index-article`, `index-project`, `remove-document`, `reindex-all` | deterministische Job-IDs (Idempotenz, Regel M-6) |
| `media` | `process-image` | CPU-intensiv; eigene Concurrency-Grenze |
| `repo-sync` | `sync-repository` | Rate-Limit-bewusst, Backoff bei 403/429 |
| `maintenance` | `cleanup-orphan-media`, `audit-retention`, `session-gc`, `recalculate-reputation` | Cron-basiert (BullMQ Repeatable) |

Worker-Modus (`worker.ts`) lädt dieselben Module, registriert aber nur Prozessoren und keine
HTTP-Listener. Compose/K8s skalieren API und Worker unabhängig.

## 7. Observability

- **Logs:** pino, JSON auf stdout, `requestId`/`userId`-Korrelation via AsyncLocalStorage
  (NFR-053). Log-Level per ENV.
- **Metriken:** `/metrics` (Prometheus): HTTP-Latenzen, Queue-Tiefen, Job-Dauern,
  DB-Pool, Cache-Hit-Raten (NFR-054).
- **Health:** `/healthz` (Prozess lebt) und `/readyz` (prüft PostgreSQL, Redis hart; Meilisearch,
  Storage, SMTP als degradierbar gemeldet — NFR-014).

## 8. Caching-Strategie (Redis)

| Cache | Inhalt | Invalidierung |
|---|---|---|
| Session-Store | Sessions (TTL = Session-Lebensdauer) | Logout/Revoke/Ablauf |
| AuthZ-Cache | effektive Permissions pro User+Scope (TTL 60 s) | Event `authorization.assignment.changed`, Gruppen-/Org-Änderungen |
| Config-Cache | Instanzeinstellungen (TTL ∞) | Event `configuration.settings.changed` |
| HTTP-Cache | anonyme SSR-/API-Antworten öffentlicher Inhalte (TTL kurz, 30–60 s) | Zeit + Publish-Events |

**Regel B-5 (MUSS):** Kein Modul hält eigene In-Memory-Caches fachlicher Daten (läuft bei
Multi-Replica auseinander) — Caching nur über die hier definierten Redis-Mechanismen.
