# Epics & User Stories — Index

**Status:** Verbindlich · **Version:** 1.1 · **Stand:** 2026-07-20

Die vollständige Ausarbeitung liegt in den **Themenordnern unter
[epics/](epics/README.md)** — pro Epic ein Ordner mit Epic-Steckbrief (`README.md`) und
User-Story-Katalog (`user-stories.md`, Given/When/Then-Akzeptanzkriterien). Diese Datei ist der
kompakte Index.

## Epic-Übersicht

| Epic | Titel & Detailordner | Phase | Kern-FRs | Story-Anzahl |
|---|---|---|---|---|
| E-01 | [Plattform-Foundation & Setup](epics/e-01-platform-foundation/README.md) | 0–1 | FR-CONF-001…007 | [6 Stories](epics/e-01-platform-foundation/user-stories.md) |
| E-02 | [Identity & Authentication](epics/e-02-identity-authentication/README.md) | 1–3 | FR-IDNT-001…020 | [10 Stories](epics/e-02-identity-authentication/user-stories.md) |
| E-03 | [Authorization (RBAC + ABAC)](epics/e-03-authorization/README.md) | 1–3 | FR-AUTZ-001…010 | [6 Stories](epics/e-03-authorization/user-stories.md) |
| E-04 | [Knowledge Core](epics/e-04-knowledge-core/README.md) | 1–2 | FR-KNOW-001…017 | [7 Stories](epics/e-04-knowledge-core/user-stories.md) |
| E-05 | [Community Translation](epics/e-05-community-translation/README.md) | 2 | FR-TRAN-001…009 | [6 Stories](epics/e-05-community-translation/user-stories.md) |
| E-06 | [Suche & Discovery](epics/e-06-search-discovery/README.md) | 1–2 | FR-SRCH-001…008 | [6 Stories](epics/e-06-search-discovery/user-stories.md) |
| E-07 | [Entwicklerprofile & Reputation](epics/e-07-developer-profiles/README.md) | 1–2 | FR-PROF-001…006 | [6 Stories](epics/e-07-developer-profiles/user-stories.md) |
| E-08 | [Organisationen & Teams](epics/e-08-organizations-teams/README.md) | 2 | FR-ORGA-001…008 | [5 Stories](epics/e-08-organizations-teams/user-stories.md) |
| E-09 | [Open-Source-Integration](epics/e-09-open-source-integration/README.md) | 2 | FR-REPO-001…007 | [5 Stories](epics/e-09-open-source-integration/user-stories.md) |
| E-10 | [Media Management](epics/e-10-media-management/README.md) | 1–2 | FR-MEDI-001…008 | [5 Stories](epics/e-10-media-management/user-stories.md) |
| E-11 | [Notifications](epics/e-11-notifications/README.md) | 1–3 | FR-NOTI-001…008 | [6 Stories](epics/e-11-notifications/user-stories.md) |
| E-12 | [Audit & Compliance](epics/e-12-audit-compliance/README.md) | 1–3 | FR-AUDT-001…006 | [5 Stories](epics/e-12-audit-compliance/user-stories.md) |
| E-13 | [Betrieb, Recovery & Observability](epics/e-13-operations-recovery/README.md) | 1–3 | FR-PLAT-005/006 | [5 Stories](epics/e-13-operations-recovery/user-stories.md) |
| E-14 | [Design System & UI Foundation](epics/e-14-design-system-ui/README.md) | 0–1 | FR-PLAT-001…003/007 | [7 Stories](epics/e-14-design-system-ui/user-stories.md) |

## Konventionen

- **Story-IDs** `US-<Epic>-<NN>` sind stabil und werden nie umgewidmet.
- Jede Story nennt Persona ([02-stakeholders-personas.md](02-stakeholders-personas.md)),
  FR-Referenzen, MoSCoW-Priorität und Phase.
- Akzeptanzkriterien sind Given/When/Then; *Must*-Stories müssen vor Phasenabschluss durch
  Tests abgedeckt sein (→ [testing/01](../testing/01-test-strategy.md)).
- Neue Stories werden im jeweiligen Epic-Ordner ergänzt und hier nur gezählt — Details leben
  ausschließlich in den Themenordnern (keine Doppelpflege).
