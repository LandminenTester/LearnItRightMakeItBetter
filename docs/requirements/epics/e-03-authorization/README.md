# E-03 · Authorization (RBAC + ABAC)

**Status:** Verbindlich · **Phase:** 1–3 · **Priorität:** Must ·
**Module:** [authorization](../../../services/authorization-service.md) ·
**FRs:** FR-AUTZ-001…010 · **ADR:** [ADR-0008](../../../architecture/decisions/adr-0008-hybrid-rbac-abac.md) ·
**Stories:** [user-stories.md](user-stories.md)

## Ziel

Feingranulare, nachvollziehbare Rechte nach **Deny-by-default** — vom öffentlichen
Community-Betrieb (Systemrollen genügen) bis zur Enterprise-Governance (Gruppen, Custom-Rollen,
attributbasierte Policies) — mit einem einzigen Entscheidungspunkt (`AccessDecisionService`)
für API, Fachlogik und Suche.

## Scope

**Enthalten:**

- Permission-Katalog (`<modul>.<ressource>.<aktion>`) als Code-Artefakt mit DB-Sync
- Systemrollen + Custom-Rollen; Scopes `global` / `organization` / `space` / `language`
- Gruppen als Rechteträger („Backend Developer Group → Backend Domain Contributor")
- ABAC-Policies (JSON-Bedingungen, allow/deny, Priorität; deny gewinnt)
- Rollen-/Gruppen-/Policy-Verwaltung in der Admin-UI, Permission-Editor-Komponente (E-14)
- Berechtigungsauskunft (effektive Rechte inkl. Herkunft)
- Entscheidungscache + Invalidierung; Privilege-Escalation-Sperren

**Nicht enthalten:** Authentifizierung/Sessions (E-02); Sichtbarkeitsattribute der Inhalte
(Fachmodule, als ABAC-Ressourcenattribute angeliefert).

## Phasenschnitt

| Phase | Inhalt |
|---|---|
| 1 | Katalog, Systemrollen, Scopes, Guards/Startup-Check, Entscheidungskern + Cache |
| 2 | Gruppen, Verwaltungs-UI, Permission-Editor, Zuweisungs-Workflows |
| 3 | ABAC-Policies, Berechtigungsauskunft, zeitgebundene Zuweisungen (Schema) |

## Abhängigkeiten

Benötigt: E-02 (Identität, Attribute wie `mfaVerified`), E-08 (Org-Mitgliedschaft als Attribut,
ab Phase 2). Blockiert: alle Fachepics — der Guard-Kern entsteht zuerst (Roadmap-Regel 4).

## Erfolgsmetriken

- Startup-Check: 100 % der Endpunkte deklarieren Permission oder `@Public()` (FR-AUTZ-008)
- Entscheidungslogik mit ≥ 95 % Branch-Coverage + Property-Tests (NFR-042)
- p95-Overhead der Zugriffsentscheidung < 5 ms (gecacht)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Rechte-Wildwuchs macht Instanzen unverwaltbar | Systemrollen decken Standardfälle; Auskunfts-UI zeigt Herkunft jeder Permission |
| Policy-Fehlkonfiguration sperrt Admins aus | letzte `platform.admin`-Zuweisung unantastbar (A-3); Recovery-System (E-13) |
| Cache-Invalidierung vergessen → veraltete Rechte | Event-getriebene Invalidierung als Pflichtpfad, Integrationstests decken Rollenentzug ab |
