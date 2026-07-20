# Docker & Compose

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Dateien:** `infrastructure/docker/`

## 1. Images

| Image | Basis | Inhalt |
|---|---|---|
| `lir-frontend` | `node:22-slim` (Digest-gepinnt), Multi-Stage | Nuxt-Build (`.output`), non-root User, `HEALTHCHECK` auf `/` |
| `lir-backend` | `node:22-slim`, Multi-Stage | NestJS-Build + Prisma-Client + CLI; startet je nach ENV als API (`node dist/main`) oder Worker (`WORKER=true → dist/worker`); `HEALTHCHECK /healthz` |

Build-Regeln: pnpm-Lockfile-Install (`--frozen-lockfile`), nur Produktions-Dependencies im
Final-Stage, `sharp` mit vorgebauten Binaries, Image-Scan (Trivy) im CI
([security/06 §4](../security/06-secure-development-pipeline.md)). Versionierung:
Release-Tag + Digest; kein `latest` in Produktion.

## 2. Dev-Stack (`infrastructure/docker/compose.dev.yml`)

Gemäß Fachkonzept §18: **Frontend, Backend, PostgreSQL, Redis, Meilisearch, MinIO, Mailhog.**

| Service | Image | Ports (Host) | Hinweise |
|---|---|---|---|
| postgres | `postgres:17` | 5432 | Volume `pg-dev`; DB `lir_dev` + `lir_test` |
| redis | `redis:7` | 6379 | `--appendonly yes --appendfsync everysec` |
| meilisearch | `getmeili/meilisearch:v1.x` | 7700 | Dev-Master-Key |
| minio | `minio/minio` | 9000/9001 | Bucket `lir-media` via Init-Job |
| mailhog | `mailhog/mailhog` | 1025/8025 | SMTP-Fänger + Web-UI |
| frontend/backend/worker | lokale Builds | 3000/3001 | optional — Standard-Dev läuft auf dem Host (`pnpm dev`) gegen die Infra-Container |

Start: `pnpm infra:up` (Compose) → `pnpm db:migrate:dev && pnpm db:seed` → `pnpm dev`.

## 3. Produktion Single-Node (`infrastructure/docker/compose.prod.yml`)

```yaml
# Auszug — maßgebliche Datei im Repo; Secrets via .env (Rechte 600)
services:
  proxy:      # Caddy: automatisches TLS; Routing gemäß 01-environments §3
  migrate:
    image: ghcr.io/<org>/lir-backend:${LIR_VERSION}
    command: ["node", "dist/cli.js", "deploy"]   # migrate deploy + base-Seed
    depends_on: { postgres: { condition: service_healthy } }
    restart: "no"
  backend:
    image: ghcr.io/<org>/lir-backend:${LIR_VERSION}
    env_file: .env
    depends_on: { migrate: { condition: service_completed_successfully }, redis: …, postgres: … }
    restart: unless-stopped
  worker:
    image: ghcr.io/<org>/lir-backend:${LIR_VERSION}
    environment: { WORKER: "true" }
    env_file: .env
    restart: unless-stopped
  frontend:
    image: ghcr.io/<org>/lir-frontend:${LIR_VERSION}
    restart: unless-stopped
  postgres:   # Volume, Healthcheck pg_isready, keine Host-Ports
  redis:      # requirepass, AOF everysec, keine Host-Ports
  meilisearch:# Master-Key, Volume, keine Host-Ports
```

**Regeln:**

- Reihenfolge erzwungen: `migrate` läuft vor App-Start (MIG-Workflow); App-Container starten
  erst nach erfolgreichem Abschluss.
- Nur `proxy` exponiert 80/443; Härtungs-Checkliste
  ([security/checklists/deployment-hardening.md](../security/checklists/deployment-hardening.md))
  ist Teil der Installationsanleitung.
- Update-Verfahren (kurze definierte Downtime, NFR-052):
  `LIR_VERSION` erhöhen → `docker compose pull` → `up -d` (migrate läuft automatisch) —
  Details/Rollback im [Upgrade-Runbook](runbooks/upgrade.md).
- Ressourcen-Limits je Service gesetzt (Referenzwerte in der Datei, abgestimmt auf 4 vCPU/8 GB);
  `media`-lastige Instanzen erhöhen Worker-Memory.

## 4. Betriebsdaten & Persistenz

Volumes: `pg-data`, `redis-data`, `meili-data`, `media-data` (bei `filesystem`).
Backup-Gegenstand sind **PostgreSQL + Media-Storage + `.env`** — Meilisearch ist
rekonstruierbar (ADR-0005), Redis verliert nur Unkritisches (Sessions → Re-Login, Queue-Jobs
sind durch AOF weitgehend geschützt). Verfahren: [Runbook Backup/Restore](runbooks/backup-restore.md).
