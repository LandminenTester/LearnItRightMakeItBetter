# E2E-Szenarien · Translation

**Epic:** E-05 · Fixtures: publizierter `en`-Artikel, Translator/Reviewer/Maintainer `de`

## TR-01 · Übersetzungs-Loop — US-05-01, US-05-02

Translator startet `de`-Übersetzung (Side-by-side: Original readonly links) → speichert,
reicht ein → Reviewer (Sprache `de`) sieht Queue-Eintrag + Benachrichtigung → approved →
Maintainer publiziert → Leser mit `?locale=de` bzw. Browser-`de` sieht deutsche Fassung mit
Sprachumschalter; `hreflang` beider Fassungen im SSR-HTML. Negativ: Translator kann eigene
Einreichung nicht approven (UI fehlt + API 403).

## TR-02 · Outdated-Kaskade — US-05-03

Original erhält neue publizierte Version → binnen 60 s: Übersetzung `outdated` (Badge),
Leser-Banner mit Link zum Original, Benachrichtigungen an Translator + Language Maintainer
(In-App + Mail) → Translator öffnet Quell-Diff (zeigt exakt Original-v[n]→v[n+1]) →
aktualisiert, Review, Publikation ⇒ Status `published`, Banner weg.

## TR-03 · Sprach-Dashboard & Rechte-Scope — US-05-04

Language Maintainer `de` sieht Dashboard (Abdeckung/Outdated/offene Reviews konsistent zu
Fixtures) und ernennt einen Reviewer für `de` → dieser kann `de` reviewen, für `fr`-Fixture
aber nicht (API 403 — Scope-Grenze T-5/A-Scopes).

## TR-04 · Archivierungs-Folge — T-6

Original archivieren ⇒ Übersetzung mit-archiviert (aus Suche beider Sprachen verschwunden);
Unarchive stellt her, Status ggf. `outdated` korrekt berechnet.

## TR-05 · Sprachverwaltung — US-05-04.3

Admin aktiviert `fr` ⇒ sofort als Ziel wählbar; deaktiviert `fr` ⇒ Einstiegspunkte weg,
bestehende `fr`-Fassung nicht mehr ausgespielt (Fallback Original), Daten bleiben (Re-Aktivierung
zeigt sie wieder).

## TR-06 · Modul-Flag — US-01-03

`translation`-Modul deaktivieren ⇒ Übersetzungs-URLs/API 404 `module_disabled`, Artikel-Seiten
zeigen keine Übersetzungs-UI; Reaktivierung stellt alles wieder her.

## TR-07 · Fallback-Leser — US-05-05

Leser mit `pt-BR` (keine Übersetzung) sieht Original ohne Fehlermeldung; Sprachumschalter
listet nur publizierte Fassungen.
