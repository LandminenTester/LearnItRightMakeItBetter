# Vorlage · Pull Request

**Quelle für `.github/PULL_REQUEST_TEMPLATE.md`**

```markdown
## Was & Warum

<!-- 2–5 Sätze: fachliche Änderung und Motivation. -->

**Referenzen:** US-XX-XX · FR-XXXX-XXX · Regeln: <!-- z. B. K-7, I-15 --> · Closes #<issue>

## Art der Änderung

- [ ] feat  - [ ] fix  - [ ] refactor  - [ ] docs  - [ ] test  - [ ] chore  - [ ] security

## Umsetzungsnotizen

<!-- Entscheidungen, Alternativen, bewusste Grenzen. Bei Abweichung von der Spezifikation:
     Link auf den Doku-Commit in diesem PR. -->

## Nachweise

- [ ] `pnpm verify` lokal grün
- [ ] relevante `test:int` / `e2e`-Suite ausgeführt: <!-- welche + Ergebnis -->
- Screenshots/Aufnahmen bei UI (beide Themes, mobil falls relevant):

## Definition of Done

- [ ] [DoD](../06-definition-of-done.md) vollständig durchgegangen; nicht zutreffende Punkte benannt

## Security

- [ ] Berührt Inhalte/Rechte/Konten/Uploads/Jobs/Konfiguration →
      [Security-Checkliste](../../security/checklists/code-review-security.md) unten beantwortet
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

- [ ] Enthält KI-generierte Anteile (Agent + Co-Authored-By-Trailer gesetzt,
      [Agentic-Regeln](../05-agentic-development.md) §3)
```
