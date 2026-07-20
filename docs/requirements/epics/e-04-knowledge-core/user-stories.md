# E-04 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [knowledge-service.md](../../../services/knowledge-service.md)

## US-04-01 · Artikel verfassen (P1 Alex) — FR-KNOW-001…003 · Must · Phase 1

> Als Contributor möchte ich einen How-To-Artikel in Markdown verfassen und als Entwurf
> speichern, damit ich in Ruhe arbeiten kann, bevor jemand anderes ihn sieht.

1. **Gegeben** ein neuer Entwurf, **wenn** ich speichere, **dann** entsteht Version 1 mit mir
   als Autor; sichtbar nur für mich und Space-Maintainer.
2. **Gegeben** der Editor, **wenn** ich Codeblöcke (mit Sprach-Highlighting), Admonitions,
   Tabellen und Bilder einfüge, **dann** zeigt die Vorschau exakt das spätere Rendering
   (identische Pipeline, K-14).
3. **Gegeben** Pflichtfelder (Titel, Typ, Space), **wenn** eines fehlt, **dann** verhindert die
   Validierung das Speichern mit Feldfehler — kein Datenverlust des Editors-Inhalts.
4. **Gegeben** Änderungen ab Version 2, **dann** ist eine Änderungsnotiz Pflicht (K-5).

## US-04-02 · Review & Publikation (P2 Mira) — FR-KNOW-004, 005, 009 · Must · Phase 1

1. **Gegeben** ein Artikel in `in_review`, **wenn** ich als Reviewer den Versions-Diff öffne,
   **dann** sehe ich Markdown-Änderungen zeilenweise markiert (auch für Erstversionen: alles neu).
2. **Gegeben** „Änderungen anfordern" mit Kommentar, **dann** wechselt der Artikel zu `draft`
   und der Autor wird benachrichtigt.
3. **Gegeben** ein `approved` der aktuellen Version in einem Space mit Review-Pflicht, **wenn**
   ein Berechtigter publiziert, **dann** ist genau diese Version live, unveränderlich und binnen
   30 s in der Suche.
4. **Gegeben** ein Space ohne Review-Pflicht, **dann** dürfen Autoren mit `publish`-Recht direkt
   publizieren (K-9/K-10).
5. **Gegeben** ich bin Autor der eingereichten Version, **dann** kann ich sie nicht selbst
   approven.

## US-04-03 · Fremde Artikel verbessern (P1 Alex) — FR-KNOW-012 · Should · Phase 2

> Als Community-Mitglied möchte ich Korrekturen an fremden Artikeln vorschlagen, damit Fehler
> nicht liegen bleiben („Make it better").

1. **Gegeben** ein publizierter Artikel, **wenn** ich „Verbesserung vorschlagen" wähle, **dann**
   editiere ich eine Kopie der publizierten Version und reiche sie als neue Version in
   `in_review` ein — die Live-Fassung bleibt unverändert.
2. **Gegeben** die Annahme durch einen Maintainer, **dann** wird meine Version publiziert; ich
   erscheine als Autor dieser Version, der ursprüngliche Autor bleibt in der Historie (K-11).
3. **Gegeben** eine Ablehnung mit Kommentar, **dann** werde ich benachrichtigt und kann
   nachbessern.

## US-04-04 · Struktur pflegen (P2 Mira) — FR-KNOW-006, 007, 008, 017 · Must · Phase 1

1. **Gegeben** `knowledge.category.manage` im Space, **wenn** ich Kategorien anlege/verschiebe/
   sortiere (max. 3 Ebenen), **dann** spiegelt die Navigation dies sofort.
2. **Gegeben** eine Slug-Änderung, **dann** funktioniert die alte URL als Redirect weiter (K-4).
3. **Gegeben** ein privater Space, **wenn** ein Unberechtigter dessen URL rät, **dann** erhält
   er 404 ohne Existenz-Hinweis (K-1).

## US-04-05 · Diskussion am Artikel (P1, P2) — FR-KNOW-010 · Should · Phase 2

1. **Gegeben** Kommentare aktiviert, **wenn** ich kommentiere oder antworte (1 Ebene), **dann**
   werden Artikel-Autor bzw. Thread-Beteiligte gemäß Präferenzen benachrichtigt.
2. **Gegeben** ein geklärter Thread, **wenn** Maintainer/Autor ihn `resolved` markiert, **dann**
   bleibt er eingeklappt einsehbar.
3. **Gegeben** mein Kommentar ≤ 15 min alt, **dann** darf ich ihn editieren (`edited`-Flag);
   Moderatoren dürfen jederzeit löschen (Tombstone bei Antworten, K-18).

## US-04-06 · Hilfreich-Feedback (P1, P8) — FR-KNOW-011 · Should · Phase 2

1. **Gegeben** ein publizierter Artikel, **wenn** ich als angemeldeter Nutzer „hilfreich" stimme,
   **dann** zählt genau eine Stimme (togglebar); der Zähler ist öffentlich sichtbar.
2. **Gegeben** meine Stimme, **dann** erhält der Autor Reputationspunkte gemäß Konfiguration
   (Event an E-07).

## US-04-07 · Archivierung (P2 Mira) — FR-KNOW-014 · Must · Phase 2

1. **Gegeben** ein veralteter Artikel, **wenn** ich ihn archiviere, **dann** zeigt er einen
   Archiv-Banner, verschwindet aus der Standard-Suche (Filter „archiviert" zeigt ihn) und
   Übersetzungen werden mit-archiviert (T-6).
2. **Gegeben** moderative Depublikation, **dann** ist sie nur mit `moderate`-Recht möglich,
   verlangt eine Begründung und wird auditiert (K-13).
