# Queue-Profile (Startwerte)

Verbindliche Queue-Liste: [docs/architecture/04 §6](../../docs/architecture/04-backend-architecture.md).
Werte werden mit Lasttest-Ergebnissen (testing/05) kalibriert.

| Queue | Jobs | Concurrency (Start) | Skalierungshinweis |
|---|---|---|---|
| `mail` | send-mail, dispatch-event | 5 | I/O-bound — Relay-Limits beachten, selten Worker-Engpass |
| `search-index` | index-*, remove-document, reindex-all | 4 | bei Index-Lag Worker-Replikat zuerst |
| `media` | process-image | 2 (CPU-gebunden) | eigener Worker-Pool ab Stufe 2/3 (`worker-media`) |
| `repo-sync` | sync-repository, schedule-repo-syncs | 3 | Rate-Limit-bewusst (R-3/R-4), mehr Concurrency bringt wenig |
| `maintenance` | GC-/Retention-/Konsistenz-Jobs | 1 | Repeatable/Cron — nie parallelisieren |

**Prozess-Zuordnung Compose (Standard):** ein `worker`-Container für alle Queues.
**K8s (Topologie B):** `worker-default` (mail, search-index, repo-sync, maintenance) +
`worker-media` getrennt ([docs/deployment/03 §1](../../docs/deployment/03-kubernetes.md)).
