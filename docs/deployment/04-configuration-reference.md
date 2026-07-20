# Konfigurationsreferenz — Umgebungsvariablen

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Vollständiger ENV-Katalog. Validierung beim Start per Zod (fail-fast,
[architecture/04 §5](../architecture/04-backend-architecture.md)). Präzedenz: **ENV >
DB-Instanzeinstellung** (C-2) — Variablen mit DB-Pendant sind mit ⧉ markiert (in der Admin-UI
dann readonly). 🔒 = Secret (nie loggen, K8s-Secret/`.env` 600).

## Kern

| Variable | Pflicht | Default | Beschreibung |
|---|---|---|---|
| `NODE_ENV` | ja | — | `production` \| `development` \| `test` |
| `APP_URL` | ja | — | Öffentliche HTTPS-Basis-URL (Cookies, Links, OAuth-Redirects) |
| `PORT` / `FRONTEND_PORT` | nein | 3001 / 3000 | interne Ports |
| `WORKER` | nein | `false` | `true` = Worker-Modus statt API |
| `TRUST_PROXY` | nein | `1` | Anzahl vertrauter Proxy-Hops (Forwarded-Header) |
| `LOG_LEVEL` | nein | `info` | pino-Level |
| `MAINTENANCE_MODE` | nein | `false` | nur Health + statische Wartungsseite |

## Sicherheit 🔒

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `APP_ENCRYPTION_KEY` | ja | 32 B Base64 — Feldverschlüsselung (security/04 §2) |
| `APP_ENCRYPTION_KEYS_OLD` | nein | Komma-Liste alter Keys für Rotation |
| `SESSION_SECRET` | ja | Cookie-/CSRF-Signierung, ≥ 32 B |
| `AUTH_PEPPER` | ja | Passwort-Pepper (security/02 §1) |
| `SESSION_IDLE_DAYS` ⧉ / `SESSION_MAX_DAYS` ⧉ | nein | 14 / 90 |

## Datenbank & Redis

| Variable | Pflicht | Default | Beschreibung |
|---|---|---|---|
| `DATABASE_URL` 🔒 | ja | — | PostgreSQL-DSN (`sslmode=require` bei externem PG) |
| `DATABASE_POOL_SIZE` | nein | 10 | pro Prozess ([database/05 §6](../database/05-prisma-and-migrations.md)) |
| `REDIS_URL` 🔒 | ja | — | inkl. Passwort |

## Suche

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `MEILI_HOST` | ja | z. B. `http://meilisearch:7700` |
| `MEILI_MASTER_KEY` 🔒 | ja | |

## Storage (ADR-0007)

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `STORAGE_DRIVER` | ja | `filesystem` \| `s3` \| `azure-blob` \| `gcs` |
| `STORAGE_FS_PATH` | bei filesystem | Volume-Pfad, z. B. `/data/media` |
| `STORAGE_S3_ENDPOINT` / `_REGION` / `_BUCKET` | bei s3 | endpoint leer = AWS |
| `STORAGE_S3_ACCESS_KEY` 🔒 / `_SECRET_KEY` 🔒 | bei s3 | |
| `STORAGE_S3_FORCE_PATH_STYLE` | nein (`true` für MinIO) | |
| `STORAGE_AZURE_CONNECTION_STRING` 🔒 / `STORAGE_GCS_*` | bei Blob/GCS (Phase 3) | |
| `MEDIA_MAX_UPLOAD_MB` ⧉ | nein · 10 | Upload-Limit (Proxy-Body-Limit ≥ +2 MB!) |

## SMTP ⧉ (alternativ komplett via Admin-UI)

`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`tls`|`starttls`|`none`), `SMTP_USER`,
`SMTP_PASSWORD` 🔒, `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME` — Dev-Default: Mailhog.

## Verschiedenes

| Variable | Default | Beschreibung |
|---|---|---|
| `API_CORS_ORIGINS` | leer (aus) | Komma-Liste für externe API-Clients (api/01 §9) |
| `METRICS_ENABLED` | `true` | `/metrics` (nur intern routen!) |
| `SEED_PROFILE` | `base` | `base` \| `dev` \| `e2e` ([database/05 §4](../database/05-prisma-and-migrations.md)) |
| `GITHUB_TOKEN` 🔒 ⧉ | leer | Bootstrap für Repo-Sync (sonst Admin-UI) |

## Nicht-ENV-Konfiguration

Fachliche Einstellungen (Registrierungsmodus, Modul-Flags, Policies, Branding, Punktwerte,
OAuth-Provider, Retention …) leben als Instanzeinstellungen in der DB — verwaltet über
Admin-UI/Setup, Registry-validiert (C-1). Bewusst **nicht** als ENV: sie sollen ohne
Neustart/Redeploy änderbar sein.

## Beispiel-Dateien

`infrastructure/docker/.env.example` (Produktion Single-Node) und `.env.dev.example` liegen
im Repo und werden mit jeder neuen Variable im selben PR gepflegt (Checklisten-Pflicht).
