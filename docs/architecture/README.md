# Architecture — Übersicht

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Dieser Bereich beschreibt die technische Gesamtarchitektur der Plattform: einen
**modularen Monolithen mit service-orientierter Binnenstruktur**, ein Nuxt-3-Frontend und die
unterstützende Infrastruktur (PostgreSQL, Redis, Meilisearch, Storage).

## Dokumente

| Dokument | Inhalt |
|---|---|
| [01-system-overview.md](01-system-overview.md) | Kontext- und Container-Sicht (C4), Techstack, Architekturprinzipien |
| [02-module-boundaries.md](02-module-boundaries.md) | Die 12 Backend-Module, erlaubte Abhängigkeiten, Kommunikationsregeln, Domain Events |
| [03-frontend-architecture.md](03-frontend-architecture.md) | Nuxt-3-Aufbau, Rendering-Strategie, State, API-Anbindung, Auth im Frontend |
| [04-backend-architecture.md](04-backend-architecture.md) | NestJS-Aufbau, Schichten, Validierung, Jobs, Konfiguration, Observability |
| [05-data-flows.md](05-data-flows.md) | Sequenzdiagramme der Kernabläufe (Login, Publikation, Übersetzung, Sync, Upload, Suche) |
| [06-scalability-evolution.md](06-scalability-evolution.md) | Skalierungspfad vom Single Node bis zur Service-Extraktion |
| [modules/](modules/README.md) | **Themenordner: Modul-Landkarten** — eine Navigationsseite pro Backend-Modul mit allen Verweisen (Spezifikation, Schema, API, Epic, Security) |
| [decisions/](decisions/README.md) | **Themenordner: Architecture Decision Records** (ADR-0001…0012) |

## Verbindlichkeit

- Die hier definierten Modulgrenzen und Kommunikationsregeln sind **MUSS**-Vorgaben; Verstöße
  werden durch Lint-Regeln erkannt (→ [NFR-041](../requirements/04-non-functional-requirements.md)).
- Architekturänderungen (neue Module, neue Infrastrukturkomponenten, geänderte
  Kommunikationsmuster) erfordern einen **neuen ADR** vor der Umsetzung
  (→ [decisions/README.md](decisions/README.md)).
