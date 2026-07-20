# Skalierung & Architektur-Evolution

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Der modulare Monolith ist bewusst so geschnitten, dass Wachstum **ohne Umbau der Fachlogik**
möglich ist. Dieser Plan definiert die Ausbaustufen und die Vorbedingungen, die dafür ab dem
ersten Commit gelten.

## 1. Invarianten (gelten ab Phase 0)

| Invariante | Warum sie Skalierung ermöglicht |
|---|---|
| API & Worker sind **stateless** (Sessions in Redis, Dateien im Storage, keine In-Memory-Fachcaches — Regel B-5) | beliebige horizontale Replikation |
| Hintergrundarbeit läuft ausschließlich über BullMQ mit idempotenten Jobs | Worker unabhängig skalierbar, verlustfrei verschiebbar |
| Modulkommunikation nur über Ports/Domain Events (Regeln M-1…M-5) | Module später als Services extrahierbar |
| Lesezugriffe kapseln sich in Repositories | Read-Replica-Routing nachrüstbar ohne Fachcode-Änderung |
| Konfiguration über ENV/DB, keine lokalen Dateien | identische Artefakte in jeder Topologie |

## 2. Ausbaustufen

### Stufe 1 — Single Node (Referenz, Compose)

Alle Container auf einem Host (→ [deployment/02](../deployment/02-docker-compose.md)).
Ziel: NFR-006 (10k Nutzer, 500 concurrent). Erste Maßnahme bei Last: Worker-Replikate erhöhen
(`media`-Queue zuerst — CPU-intensiv).

### Stufe 2 — Vertikal + getrennte Worker

Gleiche Topologie, mehr Ressourcen; API- und Worker-Container getrennt skaliert
(`WORKER=true`-Instanzen). Meilisearch und PostgreSQL erhalten dedizierte Volumes/IOPS.

### Stufe 3 — Horizontal (Kubernetes)

→ [deployment/03](../deployment/03-kubernetes.md)

- API ≥ 2 Replikate hinter Ingress (Sessions in Redis → kein Sticky-Session-Bedarf)
- Worker-Deployments pro Queue-Gruppe (`media` getrennt von `mail`/`search-index`)
- PostgreSQL: Managed/HA (z. B. CloudNativePG), Redis: Sentinel/Managed
- HTTP-Caching anonymer Inhalte am Ingress/CDN (öffentliche Artikelseiten sind cachebar)

### Stufe 4 — Lastspezifische Optimierung

Auslöser: Messwerte aus `/metrics` verletzen NFR-Ziele trotz Stufe 3.

| Symptom | Maßnahme |
|---|---|
| DB-Leselast dominiert | PostgreSQL Read Replicas; Repository-Schicht erhält Read-Routing |
| Suchlast dominiert | Meilisearch-Ressourcen erhöhen; Index-Sharding pro Sprache erwägen |
| Media-Durchsatz | dedizierter Media-Worker-Pool; Presigned-Uploads direkt zum S3-Backend |
| SSR-Last öffentlich | CDN vor öffentliche Routen, längere SWR-Fenster |

### Stufe 5 — Service-Extraktion (nur bei nachgewiesenem Bedarf)

Extraktionskandidaten in sinnvoller Reihenfolge — **jeweils eigener ADR erforderlich**:

1. **media** — klarste Grenze (Job-getrieben, eigener Storage-Zugriff, CPU-Profil)
2. **search** — kommuniziert bereits ausschließlich über Jobs/Ports
3. **notification** — reiner Konsument von Events + Empfängerdaten
4. **repository** — externe API-Interaktion, unkritische Latenz

Vorgehen je Extraktion: Modul-Ports auf HTTP/Queue-Transport umstellen (Interfaces bleiben),
eigene DB-Sicht bzw. Schema-Ownership klären, Deployment ergänzen. **Kein** Big-Bang: der
Monolith bleibt Standard-Deployment für Self-Hosting; extrahierte Services sind eine
Skalierungs-Option großer Instanzen, keine Pflicht.

## 3. Explizite Nicht-Ziele

- Kein Microservice-Split „auf Vorrat" — Betriebskomplexität widerspricht Self-Hosting-first.
- Kein verteilter Event-Broker (Kafka o. ä.) vor Stufe 5 — BullMQ/Redis deckt die Muster ab.
- Kein Multi-Region-Active-Active in 1.x.

## 4. Kapazitäts-Checkpoints

Bei jedem Meilenstein (M1–M3) wird der Lasttest (→ [testing/05](../testing/05-quality-gates-performance.md))
gegen die NFR-Ziele gefahren und die Ergebnisse werden im Betriebs-Runbook
(→ [deployment/runbooks](../deployment/runbooks/README.md)) festgehalten — Skalierungsentscheidungen
basieren auf diesen Messungen, nicht auf Vermutungen.
