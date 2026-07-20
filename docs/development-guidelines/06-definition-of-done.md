# Definition of Done

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Eine Aufgabe (Story, Fix, Refactoring) ist **fertig**, wenn alle zutreffenden Punkte erfüllt
sind. Die Liste ist Bestandteil des [PR-Templates](templates/pr-template.md); „trifft nicht
zu" ist eine gültige Antwort, „später" nicht.

## Fachlich

- [ ] Verhalten entspricht der Spezifikation (verlinkte Story-Akzeptanzkriterien +
      Service-Regeln); Abweichungen wurden **zuerst** in der Doku geändert (gleicher PR)
- [ ] Alle Akzeptanzkriterien der Story durch Tests abgedeckt (Must-Stories: Pflicht)
- [ ] Edge-/Negativpfade behandelt: ungültige Eingaben, fehlende Rechte, Konflikte, leere
      Zustände

## Qualität

- [ ] `pnpm verify` lokal grün (Lint, Typecheck, Unit, Build) — Ergebnis im PR vermerkt
- [ ] Integrations-/E2E-Tests für neue Flüsse ergänzt bzw. angepasst; keine
      Quarantäne-Umgehung
- [ ] Coverage-Ratchet hält (kein Absinken unter `main`)
- [ ] Kein neues `any`/`@ts-ignore`/Lint-Disable ohne dokumentierten Grund

## Sicherheit

- [ ] [Security-Review-Checkliste](../security/checklists/code-review-security.md)
      beantwortet (bei Berührung von Inhalten/Rechten/Konten/Uploads/Jobs/Konfiguration)
- [ ] Neue Endpunkte: Permission deklariert, AuthZ-Matrix-Fall ergänzt, Rate-Limit-Kategorie
      zugeordnet
- [ ] Pflicht-Audit-Events gemäß [Katalog](../security/07-audit-logging.md) erzeugt + getestet
- [ ] Keine Secrets/PII in Code, Logs, Tests, Fixtures

## Daten & API

- [ ] Migration erstellt, MIG-Regeln eingehalten, Schema-Referenz
      ([database/schemas](../database/schemas/README.md)) aktualisiert
- [ ] API-Änderungen: Zod-Schema in `shared-types`, OpenAPI generiert, Endpunktkatalog
      ([api/endpoints](../api/endpoints/README.md)) aktualisiert, kein v1-Breaking
- [ ] Neue ENV/Settings: Registry + [Konfigurationsreferenz](../deployment/04-configuration-reference.md)
      + `.env.example`

## UI

- [ ] Nur Design-System-Komponenten/Tokens ([Agentic-UI-Regeln](../design-system/06-agentic-ui-rules.md)
      R1–R7); neue Bausteine im Design System mit Story + Test + Doku
- [ ] Beide Themes geprüft; responsive (360 px-Check); axe-clean; i18n-Keys de + en

## Betrieb & Doku

- [ ] Neue Jobs/Queues/Metriken im Service-Doku-§6 bzw.
      [Monitoring-Runbook](../deployment/runbooks/monitoring-alerting.md) ergänzt
- [ ] Betroffene `/docs`-Dokumente synchron (Link-Check grün)
- [ ] PR nach [Template](templates/pr-template.md), Commits konventionskonform, Story-Referenz
      im Footer

## Abschluss

- [ ] CI vollständig grün · Review-Anmerkungen adressiert · gemergt · Branch gelöscht
- [ ] Story/Task im Projektmanagement geschlossen mit Verweis auf den PR
