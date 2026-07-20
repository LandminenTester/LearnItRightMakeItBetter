# services/workers

Deployment-Belange der Worker-Prozesse (Fachkonzept §19). Der **Code** der Worker lebt im
Backend (`apps/backend/src/worker.ts` + Modul-Prozessoren) — hier liegen
Betriebs-/Skalierungsprofile pro Queue-Gruppe.

| Datei | Inhalt |
|---|---|
| [queue-profiles.md](queue-profiles.md) | Queues, Concurrency-Startwerte, Skalierungshinweise |

Referenzen: [Backend-Architektur §6](../../docs/architecture/04-backend-architecture.md) ·
[Runbook Skalierung](../../docs/deployment/runbooks/scaling.md).
