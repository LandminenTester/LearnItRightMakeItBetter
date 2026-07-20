# Kubernetes-Referenz

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Dateien:** `infrastructure/kubernetes/` (Kustomize-Basis + Overlays; Helm-Chart Phase 3) ·
**Ziel:** Topologie B, Zero-Downtime-Upgrades (NFR-052)

## 1. Workloads

| Workload | Art | Replicas (Start) | Hinweise |
|---|---|---|---|
| `frontend` | Deployment | 2 | RollingUpdate; PDB `minAvailable: 1` |
| `backend` | Deployment | 2 | stateless (Sessions Redis); PDB; HPA optional (CPU + RPS) |
| `worker-default` | Deployment | 1–2 | Queues mail, search-index, repo-sync, maintenance |
| `worker-media` | Deployment | 1+ | eigene Ressourcen (CPU-intensiv, Stufe-3-Schnitt) |
| `migrate` | **Job** (pre-upgrade Hook) | 1 | `prisma migrate deploy` + base-Seed; App-Rollout wartet auf Job-Erfolg |
| `meilisearch` | StatefulSet | 1 | PVC; Verlust unkritisch (Reindex S-4) |
| PostgreSQL | extern: Operator (CloudNativePG) oder Managed | — | App erhält nur `DATABASE_URL`-Secret |
| Redis | extern: Managed oder Sentinel-Setup | — | Persistenz AOF |

## 2. Probes & Lifecycle

| Probe | Endpoint | Semantik |
|---|---|---|
| liveness (backend/worker) | `/healthz` | Prozess lebt — keine Abhängigkeitsprüfung (kein Restart-Sturm bei Meili-Ausfall) |
| readiness (backend) | `/readyz` | nimmt Traffic nur bei erreichbarem PG+Redis; degradierte Dienste melden, blockieren aber nicht (NFR-014) |
| startup (backend) | `/healthz` | großzügig (Cold Start + Prisma-Connect) |
| frontend | `/` (Nitro-Health) | |

`terminationGracePeriodSeconds: 45`; App handhabt SIGTERM: Server drainen, laufende Jobs
beenden/zurücklegen (NFR-011). `preStop`-Sleep 5 s für Endpoint-Deregistrierung.

## 3. Konfiguration & Secrets

- ConfigMap: unkritische ENV (Ports, Flags, `APP_URL`).
- **Secrets** (K8s Secret / External Secrets Operator): `DATABASE_URL`, `REDIS_URL`,
  `APP_ENCRYPTION_KEY`, `SESSION_SECRET`, `AUTH_PEPPER`, `MEILI_MASTER_KEY`, `STORAGE_*`,
  `SMTP_*` — Katalog: [04-configuration-reference.md](04-configuration-reference.md).
- Instanz-Fachkonfiguration bleibt in der DB (Admin-UI) — kein ConfigMap-Reload-Bedarf.

## 4. Netzwerk & Sicherheit

- Ingress: TLS (cert-manager), Body-Limit ≥ Upload-Limit, Routing wie Topologie A.
- **NetworkPolicies:** default-deny; backend/worker → PG/Redis/Meili/Storage; frontend →
  backend; nichts Internes vom Ingress außer frontend/backend-Routen; `/metrics` nur vom
  Monitoring-Namespace.
- Pod-Security: non-root, `readOnlyRootFilesystem: true` (tmp-Volumes für Sharp),
  `seccompProfile: RuntimeDefault`, keine Privilegien-Eskalation.
- Ressourcen-Requests/Limits verbindlich gesetzt (Startwerte im Overlay dokumentiert).

## 5. Upgrade-Ablauf (Zero-Downtime)

1. Neues Release-Tag → `migrate`-Job (expand-Migrationen, MIG-3-kompatibel)
2. RollingUpdate backend/worker/frontend (Surge 1 / Unavailable 0)
3. Post-Checks: `/readyz`, Smoke-E2E, Queue-Verarbeitung
4. Contract-Migrationen (Spalten entfernen) erst im Folge-Release

Rollback: vorheriges Image-Tag ausrollen — Migrationen sind vorwärtskompatibel innerhalb
eines Release-Fensters (MIG-3); Details [Upgrade-Runbook](runbooks/upgrade.md).

## 6. Beobachtbarkeit

ServiceMonitor für `/metrics` (Prometheus-Operator); Log-Collection via stdout (Loki/ELK
Betreiberwahl); empfohlene Alerts und Dashboards: [Runbook Monitoring](runbooks/monitoring-alerting.md).
