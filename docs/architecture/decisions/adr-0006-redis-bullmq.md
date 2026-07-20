# ADR-0006: Redis für Cache/Sessions/Rate-Limits, BullMQ für Hintergrundjobs

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Benötigt werden: widerrufbare serverseitige Sessions (ADR-0011), Rate Limiting (NFR-025),
Caching (Konfiguration, AuthZ-Entscheidungen) sowie zuverlässige asynchrone Verarbeitung für
E-Mails, GitHub-Synchronisierung, Media-Verarbeitung und Suchindexierung (Fachkonzept §7) —
alles self-hostbar in einem Container.

## Entscheidung

**Redis 7** als einziger In-Memory-Dienst für Sessions, Caches und Rate-Limits.
**BullMQ** (auf Redis) als einziges Job-System mit den Queues `mail`, `search-index`, `media`,
`repo-sync`, `maintenance` (→ [04-backend-architecture.md §6](../04-backend-architecture.md)).
Cron-artige Aufgaben laufen als BullMQ Repeatable Jobs — kein separater Scheduler.

## Betrachtete Alternativen

- **DB-basierte Queue (pg-boss)** — solide, aber schwächeres Tooling (Rate-Limit pro Queue,
  Concurrency-Steuerung, Delayed Jobs) und Redis wird ohnehin für Sessions gebraucht.
- **RabbitMQ/Kafka** — abgelehnt: zusätzliche Infrastruktur ohne Bedarf; Muster (Work Queue,
  Retry, Delay) deckt BullMQ ab.
- **In-Process-Timer/Cron** — abgelehnt: nicht Multi-Replica-fähig, kein Retry-Fundament.

## Konsequenzen

- ✅ Ein zusätzlicher Container deckt vier Bedürfnisse; Worker unabhängig skalierbar.
- ✅ Job-UI/Introspektion über Admin-Endpoints möglich (Queue-Tiefen in `/metrics`).
- ⚠️ **At-least-once**-Semantik: alle Job-Handler MÜSSEN idempotent sein (Regel M-6,
  deterministische Job-IDs).
- ⚠️ Redis ist harte Laufzeitabhängigkeit (NFR-014); Persistenzmodus AOF `everysec` wird im
  Deployment vorkonfiguriert, damit Queues Neustarts überleben
  (→ [deployment/02](../../deployment/02-docker-compose.md)).
- ⚠️ Kein Missbrauch als Datenbank: fachliche Wahrheit liegt ausschließlich in PostgreSQL
  (NFR-013).
