# ADR-0001: Modularer Monolith mit service-orientierter Binnenstruktur

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Die Plattform muss von Einzelpersonen und kleinen Teams selbst gehostet werden können
(NFR-050: Installation < 30 min; Referenz-Hardware 4 vCPU/8 GB), gleichzeitig aber
Enterprise-Szenarien und späteres Wachstum tragen. Das Fachkonzept (§6) fordert: einfache
Entwicklung, einfache Self-Hosting-Installation, klare Grenzen, spätere Skalierung möglich.

## Entscheidung

Das Backend wird als **modularer Monolith** gebaut: ein deploybares NestJS-Artefakt, intern in
12 fachliche Module mit erzwungenen Grenzen gegliedert
(→ [02-module-boundaries.md](../02-module-boundaries.md)). Modulkommunikation läuft über
explizite Ports (synchron) und Domain Events + BullMQ-Jobs (asynchron). Der Worker-Modus ist
dasselbe Artefakt ohne HTTP-Listener.

## Betrachtete Alternativen

- **Microservices von Beginn an** — abgelehnt: Betriebskomplexität (Service-Discovery, verteilte
  Transaktionen, N Deployments) widerspricht Self-Hosting-first und dem Teamzuschnitt.
- **Unstrukturierter Monolith** — abgelehnt: ohne erzwungene Grenzen entsteht der klassische
  „Big Ball of Mud"; spätere Extraktion (→ [06-scalability-evolution.md](../06-scalability-evolution.md))
  wäre faktisch unmöglich.
- **Serverless/FaaS** — abgelehnt: Vendor-Kopplung, kein sinnvolles Self-Hosting.

## Konsequenzen

- ✅ Ein Artefakt für API + Worker; einfaches Compose-Deployment; gemeinsame Transaktionen
  innerhalb einer DB.
- ✅ Extraktionspfad pro Modul bleibt offen (Stufe 5 der Evolution, je Extraktion ein ADR).
- ⚠️ Modulgrenzen müssen technisch erzwungen werden (Lint/dependency-cruiser, NFR-041) — Pflicht
  ab Phase 0.
- ⚠️ Ein fehlerhaftes Modul kann den Prozess beeinträchtigen; Gegenmittel: saubere
  Fehlerisolation in Jobs, Health-Degradation (NFR-014).
