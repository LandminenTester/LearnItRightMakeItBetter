# E-05 · Community Translation

**Status:** Verbindlich · **Phase:** 2 · **Priorität:** Must ·
**Module:** [translation](../../../services/translation-service.md) ·
**FRs:** FR-TRAN-001…009 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Wissen überwindet Sprachgrenzen — **durch Menschen, mit Review-Qualität und ohne KI-Zwang**
(Fachkonzept §9). Übersetzungen sind vollwertige, versionierte Inhalte mit eigenem Workflow
(Vorschlag → Review → Freigabe → Veröffentlichung) und automatischer Outdated-Erkennung, wenn
das Original weiterzieht.

## Scope

**Enthalten:**

- Übersetzungen pro Artikel/Zielsprache mit eigenem Lifecycle + Versionierung
- Quellversions-Bindung (`sourceVersionId`) und Outdated-Kaskade
- Rollen: Translator, Translation Reviewer, Language Maintainer (Scope `language`)
- Side-by-side-Editor, Quell-Diff („was hat sich im Original geändert?")
- Sprachverwaltung (aktivierte Content-Sprachen), Fortschritts-Dashboards je Sprache
- Leser-Sprachauflösung mit Fallback + `hreflang`
- Optionale MT-Provider-Schnittstelle (nur Entwurfs-Vorbefüllung, Could)

**Nicht enthalten:** UI-Lokalisierung der Plattform (NFR-033, getrenntes System);
Original-Review-Prozesse (E-04).

## Abhängigkeiten

Benötigt: E-04 (publizierte Artikel/Versionen), E-03 (Language-Scope-Rollen), E-11
(Outdated-/Review-Benachrichtigungen). Liefert Events an: E-06, E-07, E-11.

## Erfolgsmetriken

- Original-Publikation → Outdated-Markierung aller betroffenen Übersetzungen ≤ 60 s
- Übersetzungs-Loop E2E grün ([testing/scenarios](../../../testing/scenarios/translation.md))
- Sprach-Dashboard zeigt Abdeckung/Outdated-Quote konsistent zu den Rohdaten

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Übersetzungen veralten unbemerkt | Outdated-Automatik (T-3) + Benachrichtigungen + Dashboard-Sicht |
| Sprachen ohne aktive Maintainer verwaisen | Dashboard macht Lücken sichtbar; Language-Maintainer-Rolle delegierbar |
| Inkonsistente Terminologie | Glossar-Funktion als Folgethema (Offener Punkt), Review-Pflicht fängt Gröbstes |
