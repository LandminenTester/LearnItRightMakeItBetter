# Checkliste · Security-Review im PR

**Status:** Verbindlich · Pflicht für PRs, die Inhalte, Rechte, Konten, Uploads, Jobs oder
Konfiguration berühren. Der PR-Autor beantwortet, der Reviewer verifiziert
(→ [PR-Template](../../development-guidelines/templates/pr-template.md)).

## Fragen an den PR

1. **AuthZ:** Welche Permission schützt jeden neuen/geänderten Endpunkt? Wo wird das Objekt
   gegen seinen Kontext geprüft (IDOR)? Negativtests vorhanden (Rolle × Scope-Matrix)?
2. **Input:** Sind alle neuen Eingaben Zod-`strict()` mit Limits? Auch externe Antworten
   (Provider/GitHub)?
3. **Output:** Entsteht irgendwo HTML aus Nutzerinput außerhalb der zentralen Pipeline?
   Neue Felder in öffentlichen Antworten — geben sie mehr preis als nötig (auch `/instance/meta`)?
4. **Leaks:** Können Listen/Suche/Facetten/Zähler/Sitemap/Timing die Existenz oder Inhalte
   nicht-berechtigter Ressourcen verraten? Leak-Test ergänzt?
5. **Secrets/PII:** Neue Secrets verschlüsselt + write-only? Neue PII im Inventar
   ([database/06](../../database/06-data-lifecycle-gdpr.md)) + Lösch-Kaskade + Export ergänzt?
   Log-/Audit-Redaction geprüft?
6. **Missbrauch:** Rate Limits/Quotas für neue teure oder missbrauchbare Aktionen? Idempotenz
   bei Jobs/kritischen POSTs?
7. **Audit:** Pflicht-Ereignisse aus [07](../07-audit-logging.md) erzeugt + getestet?
8. **Abhängigkeiten:** Neue Dependencies begründet (Wartung, Lizenz, Alternativen)?
   Lockfile-Diff geprüft?
9. **Threat Model:** Führt der PR eine neue externe Schnittstelle/Datenquelle ein? → Eintrag
   in [01 §4](../01-security-architecture-threat-model.md) ergänzt/geprüft.

## Reviewer-Kurzprüfung

- [ ] Antworten plausibel und im Diff verifiziert (Stichproben)
- [ ] Semgrep/CodeQL/SCA grün bzw. Findings sauber begründet
- [ ] Kein `// @ts-ignore`, kein `any`, kein auskommentierter Sicherheitscode
- [ ] Tests decken die Negativpfade ab (nicht nur Happy Path)
