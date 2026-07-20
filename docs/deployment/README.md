# Deployment — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Self-Hosting ist Kernversprechen der Plattform (Fachkonzept §16/§18): Docker Compose für
Entwicklung und Single-Node-Produktion, Kubernetes für skalierte Deployments — vollständig
über Umgebungsvariablen und Setup Wizard konfigurierbar.

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-environments-topologies.md](01-environments-topologies.md) | Umgebungen, Referenztopologien, Netzwerk-/Proxy-Modell |
| [02-docker-compose.md](02-docker-compose.md) | Images, Compose-Setups Dev + Produktion Single-Node |
| [03-kubernetes.md](03-kubernetes.md) | K8s-Referenz: Workloads, Probes, Skalierung, Migrationen |
| [04-configuration-reference.md](04-configuration-reference.md) | **Vollständiger ENV-Variablen-Katalog** |
| [05-setup-wizard.md](05-setup-wizard.md) | Ablauf der Ersteinrichtung (Checks, Admin, Recovery) |
| [runbooks/](runbooks/README.md) | **Themenordner: Betriebs-Runbooks** — Backup/Restore, Upgrade, Monitoring, Skalierung, Incident/Recovery |

## Leitplanken

- **Ein Artefakt-Satz:** identische Images für Compose und K8s; Verhalten steuern ENV +
  Instanzeinstellungen (NFR-051), keine Image-Varianten pro „Edition"
  ([ADR-0009](../architecture/decisions/adr-0009-single-codebase-no-editions.md)).
- **Sichere Defaults:** interne Dienste nie öffentlich; Betreiber-Härtung nach
  [security/checklists/deployment-hardening.md](../security/checklists/deployment-hardening.md).
- **Betriebsziele:** NFR-050…056 (Installierbarkeit, Logs, Metriken, Backups, Upgrades,
  Statelessness).
