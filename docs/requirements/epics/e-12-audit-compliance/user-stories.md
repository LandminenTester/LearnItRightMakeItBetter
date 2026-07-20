# E-12 · User Stories

**Epic:** [README.md](README.md) · Ereigniskatalog: [security/07](../../../security/07-audit-logging.md)

## US-12-01 · Lückenlos protokolliert (P6 Claire) — FR-AUDT-001, 002 · Must · Phase 1

1. **Gegeben** eine Rechteänderung (Rolle zugewiesen), **dann** existiert ein Audit-Event mit
   Actor, Ziel-Nutzer, Rolle, Scope, Vorher/Nachher, Zeitstempel, IP und Request-ID.
2. **Gegeben** ein fehlgeschlagener Login, **dann** wird er mit Methode und IP erfasst — ohne
   das eingegebene Passwort oder andere Secrets.
3. **Gegeben** ein Audit-Event, **dann** gibt es keinerlei API/UI-Weg, es zu ändern oder zu
   löschen (append-only; Bereinigung nur via Retention).

## US-12-02 · Auswerten & exportieren (P6 Claire) — FR-AUDT-003, 004 · Must/Should · Phase 3

1. **Gegeben** der Audit-Viewer, **wenn** ich nach „Rechteänderungen, letzte 30 Tage,
   Actor = X" filtere, **dann** sehe ich die Treffer paginiert mit allen Details.
2. **Gegeben** ein Filter-Ergebnis, **wenn** ich exportiere, **dann** erhalte ich CSV oder JSON
   mit identischem Inhalt; der Export selbst wird auditiert.

## US-12-03 · Retention (P7 Sam) — FR-AUDT-005 · Must · Phase 3

1. **Gegeben** Retention 365 Tage (Default), **dann** entfernt der nächtliche Job ältere
   Ereignisse und protokolliert die Bereinigung (Anzahl, Zeitraum) als eigenes Event.
2. **Gegeben** eine Retention-Änderung, **dann** ist sie selbst auditiert und greift ab dem
   nächsten Lauf.

## US-12-04 · DSGVO-Auskunft & Export (alle) — FR-IDNT-018 · Must · Phase 2

1. **Gegeben** mein Konto, **wenn** ich „Meine Daten exportieren" wähle, **dann** erhalte ich
   (nach Re-Auth) ein JSON-Archiv: Kontodaten, Profil, Einstellungen, eigene Inhalte
   (Markdown-Quellen), Beitragsverweise.
2. **Gegeben** der Export, **dann** wird er asynchron erstellt, zeitlich begrenzt zum Download
   angeboten und auditiert.

## US-12-05 · DSGVO-Löschung (P6 Claire, alle) — FR-IDNT-018 · Must · Phase 2

1. **Gegeben** ein Löschantrag, **wenn** die Löschung ausgeführt ist, **dann** sind PII entfernt
   (E-Mail, Name, Bio, Identitäten, Sessions, Tokens), Beiträge unter „Gelöschtes Mitglied"
   anonymisiert erhalten und Suchdokumente des Profils entfernt.
2. **Gegeben** Audit-Einträge des gelöschten Kontos, **dann** bleiben sie mit pseudonymisierter
   Referenz erhalten (berechtigtes Interesse, dokumentiert in
   [database/06](../../../database/06-data-lifecycle-gdpr.md)).
3. **Gegeben** ein Admin-initiierter Löschvorgang, **dann** verlangt er Begründung und
   Vier-Augen-Bestätigung (zweiter Admin) — beides auditiert.
