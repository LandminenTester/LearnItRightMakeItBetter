# E-07 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [profile-service.md](../../../services/profile-service.md)

## US-07-01 · Mein Profil gestalten (P1 Alex) — FR-PROF-001 · Must · Phase 1

1. **Gegeben** meine Profilbearbeitung, **wenn** ich Bio (Markdown-Subset), Standort, Website,
   Social Links (validierte `https://`-URLs) und bis zu 20 Skills setze, **dann** erscheinen sie
   auf meiner öffentlichen Profilseite `/u/<handle>`.
2. **Gegeben** ein Handle-Wechsel, **dann** leitet die alte Profil-URL 90 Tage weiter
   (Regel I-2).
3. **Gegeben** unzulässige Links (`javascript:`, `http://`), **dann** verhindert die Validierung
   das Speichern mit Feldfehler.

## US-07-02 · Beiträge zeigen (P1 Alex, P8 Gast) — FR-PROF-002 · Must · Phase 2

1. **Gegeben** mein Profil, **wenn** jemand es öffnet, **dann** sieht er meine Beiträge
   (publizierte Artikel, Reviews, Übersetzungen, Projekte) chronologisch — aber nur die Inhalte,
   die **der Betrachter** sehen darf (P-7).
2. **Gegeben** meine Einstellung „Beiträge: nur Mitglieder", **dann** sehen anonyme Besucher den
   Bereich nicht.

## US-07-03 · Reputation verdienen (P1 Alex) — FR-PROF-003 · Must · Phase 2

1. **Gegeben** meine Übersetzung wird publiziert, **wenn** das Ereignis verarbeitet ist, **dann**
   steigt meine Reputation um den konfigurierten Wert (Default +15) — genau einmal, auch bei
   Job-Wiederholung (P-2).
2. **Gegeben** mein Artikel wird moderativ depubliziert, **dann** werden die Punkte
   zurückgebucht (P-4); mein Ledger zeigt beide Buchungen nachvollziehbar.
3. **Gegeben** die Instanz ändert Punktwerte, **dann** gelten sie ab sofort für neue Ereignisse;
   Historie wird nicht rückwirkend umgerechnet (außer explizitem Admin-Rebuild).

## US-07-04 · Achievements (P1 Alex) — FR-PROF-004 · Should · Phase 2

1. **Gegeben** mein erster publizierter Artikel, **dann** erhalte ich das Achievement
   „Erster Artikel" mit In-App-Benachrichtigung; es erscheint in meinem Profil.
2. **Gegeben** ein bereits verliehenes Achievement, **dann** wird es nie doppelt verliehen (P-5).
3. **Gegeben** Achievements instanzweit deaktiviert, **dann** verschwinden Anzeige und Vergabe;
   bereits verliehene bleiben gespeichert.

## US-07-05 · Privatsphäre steuern (P1 Alex) — FR-PROF-005 · Should · Phase 2

1. **Gegeben** meine Einstellungen (`showContributions`, `showReputation`,
   `showAchievements` je `public`/`members`/`private`), **wenn** ich sie ändere, **dann** greifen
   sie sofort auf Profilseite und Suche.
2. **Gegeben** vollständig privates Profil, **dann** zeigt `/u/<handle>` nur Handle +
   Anzeigename (Attribution publizierter Inhalte bleibt bestehen — CC BY-SA).

## US-07-06 · Reputation reparieren (P7 Sam) — FR-PROF-006 · Should · Phase 2

1. **Gegeben** ein Inkonsistenz-Verdacht, **wenn** ich als Admin `recalculate-reputation` starte,
   **dann** wird die Summary deterministisch aus der Ereignishistorie neu aufgebaut;
   Admin-Korrekturbuchungen bleiben erhalten (P-6).
2. **Gegeben** eine manuelle Korrektur (±Punkte mit Pflicht-Begründung), **dann** ist sie im
   Ledger als solche markiert und auditiert.
