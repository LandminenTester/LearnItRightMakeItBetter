# E2E-Szenarien · Wissens-Loop

**Epics:** E-04, E-06, E-10 · **Kern-Abnahme M1** (Roadmap)

## WL-01 `@core` · Vollständiger Loop — US-04-01, US-04-02, US-06-01

1. **Member** erstellt How-To-Entwurf (Markdown mit Codeblock, Admonition, Bild-Upload 2 MB) —
   Preview zeigt Rendering identisch zur späteren Anzeige; Bild wird `ready` (Platzhalter
   ersetzt, US-10-01).
2. Member reicht ein (`submit`) → **Reviewer** sieht Eintrag in Review-Queue + erhält
   Benachrichtigung (Mailhog + In-App).
3. Reviewer öffnet Diff (Erstversion), fordert Änderungen an (Kommentar) → Artikel zurück in
   `draft`, Autor benachrichtigt.
4. Member ändert (neue Version, Änderungsnotiz Pflicht), reicht erneut ein → Reviewer
   approved → **Maintainer** publiziert.
5. Assertions: Artikel öffentlich sichtbar (anonymer Kontext), Version unveränderlich,
   `expectSearchable(titel)` ≤ 30 s (NFR-008), Meta/OG-Tags + kanonische URL im SSR-HTML
   (FR-PLAT-004).

## WL-02 `@core` · Verbesserungsvorschlag — US-04-03

Anderer Member schlägt Korrektur am publizierten Artikel vor → Live-Fassung bleibt unverändert
(anonym geprüft) → Maintainer nimmt an → neue Version live, Vorschlagender in
Versionshistorie attributiert.

## WL-03 · Versionskonflikt — K-7

Zwei Sessions desselben Artikels: A publiziert eine neue Version; B speichert auf alter Basis
→ 409-Warnung mit Diff gegen aktuelle Fassung, B kann übernehmen/verwerfen — kein stiller
Überschreib.

## WL-04 · Kommentare & Hilfreich — US-04-05, US-04-06

Kommentar + Antwort (Benachrichtigung an Beteiligte), Maintainer resolved (eingeklappt
sichtbar); Hilfreich-Stimme togglet genau einmal, Zähler öffentlich korrekt.

## WL-05 · Archivierung — US-04-07

Maintainer archiviert → Banner sichtbar, Artikel aus Standard-Suche verschwunden
(Filter „archiviert" findet ihn), Redirects intakt; Unarchive stellt her.

## WL-06 · Struktur & Slugs — US-04-04

Kategorie anlegen/verschieben (Navigation folgt), Artikel-Slug ändern → alte URL leitet um
(auch API), privater Space per URL-Raten → 404 ohne Existenz-Hinweis (API-Negativfall).

## WL-07 · Upload-Abwehr — US-10-02

Fake-`.png` (Script-Inhalt) → Ablehnung mit `unsupported_media_type`; 40-MP-Bombe → Status
`failed`, kein Objekt ausgeliefert; Audit-Events vorhanden (`media.object.rejected`).

## WL-08 `@core` · Such-Leak-Stichprobe — US-06-02

Artikel in privatem Space publizieren → anonym + fremder Member: kein Treffer in Suche,
Suggest, Facetten-Zählern; Org-Mitglied findet ihn (Vollprüfung in
[organization-enterprise.md](organization-enterprise.md)).
