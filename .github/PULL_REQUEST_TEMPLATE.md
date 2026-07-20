<!-- Quelle & Erläuterungen: docs/development-guidelines/templates/pr-template.md -->

## Was & Warum

<!-- 2–5 Sätze: fachliche Änderung und Motivation. -->

**Referenzen:** US-XX-XX · FR-XXXX-XXX · Regeln: <!-- z. B. K-7, I-15 -->

## Art der Änderung

- [ ] feat  - [ ] fix  - [ ] refactor  - [ ] docs  - [ ] test  - [ ] chore  - [ ] security

## Nachweise

- [ ] `pnpm verify` lokal grün
- [ ] relevante Integrations-/E2E-Suiten ausgeführt: <!-- welche + Ergebnis -->
- Screenshots bei UI (beide Themes, mobil falls relevant):

## Definition of Done

- [ ] [DoD](docs/development-guidelines/06-definition-of-done.md) vollständig durchgegangen;
      nicht zutreffende Punkte benannt

## Security

- [ ] Berührt Inhalte/Rechte/Konten/Uploads/Jobs/Konfiguration →
      [Security-Checkliste](docs/security/checklists/code-review-security.md) im Ausklapp-Block beantwortet
- [ ] Nicht berührt (Begründung: <!-- … -->)

<details><summary>Antworten Security-Checkliste (falls zutreffend)</summary>

1. AuthZ: …
2. Input: …
3. Output: …
4. Leaks: …
5. Secrets/PII: …
6. Missbrauch: …
7. Audit: …
8. Abhängigkeiten: …
9. Threat Model: …

</details>

## Migrations-/Betriebshinweise

<!-- Neue ENV? Migrationsdauer? Reindex nötig? „Keine" ist eine gültige Antwort. -->

## Herkunft

- [ ] Enthält KI-generierte Anteile
      ([Agentic-Regeln](docs/development-guidelines/05-agentic-development.md) §3 eingehalten)
