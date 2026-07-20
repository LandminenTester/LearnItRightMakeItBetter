# Epics — Themenordner

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Jeder Themenbereich der Plattform ist als Epic-Ordner ausgearbeitet. Pro Ordner:

- **`README.md`** — Epic-Steckbrief: Ziel, Scope (in/out), FR-Mapping, beteiligte Module,
  Abhängigkeiten, Erfolgsmetriken, Risiken
- **`user-stories.md`** — vollständiger User-Story-Katalog mit Akzeptanzkriterien

Die Übersichtsdatei [../05-epics-user-stories.md](../05-epics-user-stories.md) dient als
kompakter Index; die Ordner hier sind die verbindliche Detailebene.

## Themenbereiche

| Epic | Ordner | Phase | Kernmodule |
|---|---|---|---|
| E-01 Plattform-Foundation & Setup | [e-01-platform-foundation/](e-01-platform-foundation/README.md) | 0–1 | configuration |
| E-02 Identity & Authentication | [e-02-identity-authentication/](e-02-identity-authentication/README.md) | 1–3 | identity |
| E-03 Authorization (RBAC + ABAC) | [e-03-authorization/](e-03-authorization/README.md) | 1–3 | authorization |
| E-04 Knowledge Core | [e-04-knowledge-core/](e-04-knowledge-core/README.md) | 1–2 | knowledge, media |
| E-05 Community Translation | [e-05-community-translation/](e-05-community-translation/README.md) | 2 | translation |
| E-06 Suche & Discovery | [e-06-search-discovery/](e-06-search-discovery/README.md) | 1–2 | search |
| E-07 Entwicklerprofile & Reputation | [e-07-developer-profiles/](e-07-developer-profiles/README.md) | 1–2 | profile |
| E-08 Organisationen & Teams | [e-08-organizations-teams/](e-08-organizations-teams/README.md) | 2 | organization |
| E-09 Open-Source-Integration | [e-09-open-source-integration/](e-09-open-source-integration/README.md) | 2 | repository |
| E-10 Media Management | [e-10-media-management/](e-10-media-management/README.md) | 1–2 | media |
| E-11 Notifications | [e-11-notifications/](e-11-notifications/README.md) | 1–3 | notification |
| E-12 Audit & Compliance | [e-12-audit-compliance/](e-12-audit-compliance/README.md) | 1–3 | audit, identity |
| E-13 Betrieb, Recovery & Observability | [e-13-operations-recovery/](e-13-operations-recovery/README.md) | 1–3 | configuration, alle |
| E-14 Design System & UI Foundation | [e-14-design-system-ui/](e-14-design-system-ui/README.md) | 0–1 | Frontend/Design System |

## Story-Konventionen

- Story-IDs: `US-<Epic>-<NN>` — stabil, werden nie umgewidmet.
- Jede Story nennt Persona ([../02-stakeholders-personas.md](../02-stakeholders-personas.md)),
  referenzierte FRs und Akzeptanzkriterien im Given/When/Then-Format.
- Stories der Priorität *Must* müssen vor Phasenabschluss durch Tests abgedeckt sein
  (→ [testing/01](../../testing/01-test-strategy.md)).
