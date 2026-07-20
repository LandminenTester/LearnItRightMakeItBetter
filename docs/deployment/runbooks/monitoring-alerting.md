# Runbook · Monitoring & Alerting

**Bezug:** NFR-053/054, FR-PLAT-005 · Endpoints: `/healthz`, `/readyz`, `/metrics`

## 1. Metriken (Prometheus, `/metrics` — nur intern erreichbar)

| Metrik (Präfix `lir_`) | Typ | Zweck |
|---|---|---|
| `http_request_duration_seconds{route,method,status}` | Histogram | NFR-001/002-Überwachung |
| `http_requests_total` | Counter | Traffic, Fehlerraten |
| `queue_depth{queue}` / `queue_failed_total{queue}` | Gauge/Counter | BullMQ-Gesundheit |
| `job_duration_seconds{queue,job}` | Histogram | Media/Sync/Index-Dauern |
| `db_pool_active` / `db_pool_waiting` | Gauge | Pool-Sättigung |
| `cache_hits_total{cache}` / `cache_misses_total` | Counter | AuthZ-/Config-Cache |
| `search_index_lag_seconds` | Gauge | Publikation → indexiert (NFR-008) |
| `mail_delivery_total{status}` | Counter | SMTP-Zustellung |
| `readyz_dependency_up{dependency}` | Gauge | PG/Redis/Meili/Storage/SMTP je 0/1 |

Node-/Container-Metriken (CPU, RAM, Disk) liefert der Betreiber-Stack (node_exporter/cAdvisor).

## 2. Empfohlene Alerts (Startwerte)

| Alert | Bedingung | Schwere |
|---|---|---|
| API down | `healthz` fehlgeschlagen 2 min | critical |
| Readiness degraded | `readyz_dependency_up == 0` für 5 min (je Dependency) | warning (Meili/SMTP) / critical (PG/Redis) |
| Fehlerrate | 5xx-Anteil > 2 % über 10 min | critical |
| Latenz | p95 Lese-Routen > 300 ms über 15 min (NFR-001) | warning |
| Queue-Stau | `queue_depth` wachsend + Alter ältester Job > 10 min | warning; `mail` > 30 min critical |
| Dead-Letter | `queue_failed_total` steigt | warning → Admin-Systemseite prüfen (US-13-05) |
| Index-Lag | `search_index_lag_seconds > 120` | warning |
| Disk | PG-/Media-Volume > 80 % | warning, > 90 % critical |
| Backup ausgeblieben | kein Erfolg < 26 h | critical |
| Zertifikat | TLS-Ablauf < 14 Tage | warning |

## 3. Logs

- Format: JSON auf stdout (pino), Felder `time, level, msg, requestId, userId?, module`.
- Sammeln: Compose → Loki/Promtail oder `docker logs`-Rotation; K8s → Betreiber-Stack.
- Diagnose-Rezepte:
  - Fehler eines Nutzers: `requestId` aus Problem-Details-Antwort → alle Zeilen filtern.
  - Security-Verdacht: Audit-Viewer zuerst ([E-12](../../requirements/epics/e-12-audit-compliance/README.md)),
    Logs für Technik-Kontext.
  - Job-Fehler: Admin-Systemseite (Dead-Letter-Payload) + `job_duration`-Ausreißer.

## 4. Mail-Zustellbarkeit

SPF (`include`-Mechanismus des Relays), DKIM (Signatur durch Relay oder eigenes Selector-Setup),
DMARC (`p=quarantine` empfohlen) für die Absenderdomain; Bounce-Adresse überwachen;
`mail_delivery_total{status="failed"}`-Alert; Testmail nach jeder SMTP-Änderung (US-11-01).

## 5. Synthetische Checks (empfohlen)

Extern: `GET /` (Frontend), `GET /api/v1/healthz`, Login-Synthetic (Staging), Suche-Query —
je 1–5 min Intervall vom Monitoring-Standort.
