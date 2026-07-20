# Runbook · Skalierung

**Bezug:** [architecture/06](../../architecture/06-scalability-evolution.md) (Ausbaustufen) ·
NFR-001…008, NFR-056

Skalierungsentscheidungen basieren auf Messwerten ([monitoring-alerting.md](monitoring-alerting.md)) —
nicht auf Gefühl. Diagnose → kleinste wirksame Maßnahme → erneut messen.

## Symptom → Maßnahme

| Symptom (Metrik) | Wahrscheinliche Ursache | Maßnahme (Reihenfolge) |
|---|---|---|
| `http_request_duration` p95 steigt, CPU backend hoch | API-CPU-Grenze | 1) Backend-Replikat (+`docker compose up -d --scale backend=2` hinter Proxy / K8s HPA) 2) Node-CPU erhöhen |
| p95 hoch, `db_pool_waiting > 0` | DB-Pool/Query-Engpass | 1) `DATABASE_POOL_SIZE` justieren (Summe < `max_connections` − 10) 2) langsame Queries via `pg_stat_statements` 3) PG-Ressourcen 4) Read Replicas (Stufe 4 — Issue ans Projekt) |
| `queue_depth{media}` wächst, Uploads langsam `ready` | Media-CPU | Worker-Replikat für media (`worker-media` skaliert getrennt), Worker-CPU erhöhen |
| `queue_depth{mail}` wächst | SMTP langsam/limitiert | Relay-Limits prüfen; Worker hilft selten (I/O-bound) — Provider-Kontingent |
| `search_index_lag_seconds` hoch | Index-Worker/Meili | 1) Worker-Replikat (search-index) 2) Meili-RAM/CPU (Indexgröße ~ RAM) |
| Suche p95 > 200 ms | Meili-Ressourcen | Meili-CPU/RAM erhöhen; Filterlast prüfen (Facetten) |
| SSR-TTFB öffentlich hoch | Frontend-CPU / Cache-Misses | 1) Frontend-Replikat 2) SWR-Fenster erhöhen 3) CDN vor öffentliche Routen (Stufe 3/4) |
| Redis-Latenz / Memory | Cache-/Session-Volumen | Redis-Memory erhöhen, Eviction-Policy prüfen (`noeviction` für Queues!), ggf. getrennte Redis-Instanzen Cache vs. Queues |
| Disk PG wächst schnell | Audit/Versionen | Retention prüfen (FR-AUDT-005), `pg_repack` bei Bloat; Storage-Ausbau |

## Vertikal vs. horizontal (Kurzregel)

Single Node zuerst vertikal (einfachster Hebel) + Worker-Trennung; ab dauerhaft > 70 %
CPU-Auslastung oder HA-Bedarf → Topologie B (K8s, [03-kubernetes.md](../03-kubernetes.md)).
API/Worker/Frontend sind stateless — horizontale Skalierung ist immer sicher (NFR-056);
**nie** skalieren: `migrate` (Job), Meilisearch-Replikate (1.0: Single-Writer).

## Kapazitäts-Checkpoints

Nach jeder Skalierungsänderung: k6-Smoke gegen Staging
([testing/05](../../testing/05-quality-gates-performance.md)), Kernmetriken 48 h beobachten,
Änderung im Betriebstagebuch dokumentieren. Grenzen der Stufe erreicht → nächste Stufe der
[Evolution](../../architecture/06-scalability-evolution.md) einleiten (Stufe 5 =
Extraktions-ADR im Projekt).
