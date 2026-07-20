# E-05 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [translation-service.md](../../../services/translation-service.md)

## US-05-01 · Übersetzung erstellen (P3 Jonas) — FR-TRAN-001, 002, 006 · Must

> Als Translator möchte ich einen Artikel im Side-by-side-Editor übersetzen und zur Prüfung
> einreichen, damit meine Sprache versorgt ist.

1. **Gegeben** ein publizierter Artikel (Original `en`) und aktivierte Sprache `de`, **wenn**
   ich „Übersetzen" wähle, **dann** öffnet sich der Side-by-side-Editor (Original links,
   readonly; Übersetzung rechts) und meine Fassung bindet sich an die aktuelle Originalversion
   (`sourceVersionId`, T-2).
2. **Gegeben** eine bereits begonnene Übersetzung derselben Sprache, **dann** kann ich keine
   parallele zweite anlegen, sondern sehe die bestehende mit Status und Bearbeiter.
3. **Gegeben** mein Entwurf, **wenn** ich einreiche (`submit`), **dann** wandert er in die
   Review-Queue der Sprache und Reviewer werden benachrichtigt.

## US-05-02 · Übersetzung reviewen (P3 als Reviewer) — FR-TRAN-002, 004 · Must

1. **Gegeben** `translation.review.review` für `de`, **wenn** ich eine eingereichte Übersetzung
   öffne, **dann** sehe ich Original und Übersetzung nebeneinander plus Diff zu einer etwaigen
   früheren Übersetzungsversion.
2. **Gegeben** meine Freigabe, **wenn** ein Berechtigter publiziert, **dann** sehen Leser mit
   Spracheinstellung `de` die Übersetzung statt des Originals (T-7).
3. **Gegeben** ich bin selbst der Translator, **dann** kann ich meine Einreichung nicht selbst
   freigeben (T-5).

## US-05-03 · Outdated-Kaskade (P3 Jonas) — FR-TRAN-003, 008 · Must

1. **Gegeben** meine publizierte Übersetzung (basiert auf Original-Version 3), **wenn** das
   Original Version 4 publiziert, **dann** wechselt meine Übersetzung binnen 60 s auf
   `outdated` und ich sowie der Language Maintainer werden benachrichtigt.
2. **Gegeben** ein Leser der `outdated`-Fassung, **dann** sieht er einen Hinweis („basiert auf
   älterer Version") mit Link zum Original — die Übersetzung bleibt lesbar (T-4).
3. **Gegeben** die Aktualisierung, **wenn** ich den Quell-Diff öffne, **dann** sehe ich genau
   die Änderungen zwischen Version 3 und 4 des Originals und kann gezielt nachziehen.
4. **Gegeben** meine aktualisierte Fassung wird publiziert, **dann** ist der Status wieder
   `published`.

## US-05-04 · Sprache verantworten (P3 Jonas) — FR-TRAN-004, 005, 007 · Must

1. **Gegeben** meine Rolle `language.maintainer` für `de`, **wenn** ich das Sprach-Dashboard
   öffne, **dann** sehe ich pro Space: publizierte Artikel, Übersetzungsabdeckung,
   Outdated-Quote und offene Reviews.
2. **Gegeben** mein Scope `de`, **wenn** ich Reviewer ernenne (`translation.reviewer`), **dann**
   gilt das nur für `de` — andere Sprachen bleiben unberührt.
3. **Gegeben** Admin-Rechte, **wenn** ich eine neue Content-Sprache aktiviere, **dann** ist sie
   sofort als Übersetzungsziel wählbar; Deaktivierung versteckt Fassungen, löscht sie nicht.

## US-05-05 · Lesen in meiner Sprache (P8 Gast) — FR-TRAN-008 · Must

1. **Gegeben** Browser-/Profil-Sprache `de` und vorhandene `de`-Übersetzung, **wenn** ich einen
   Artikel öffne, **dann** sehe ich die deutsche Fassung mit Sprachumschalter (alle publizierten
   Fassungen + Original).
2. **Gegeben** keine Übersetzung in meiner Sprache, **dann** sehe ich das Original ohne
   Fehlermeldung; `hreflang`-Tags listen alle Fassungen (SEO).

## US-05-06 · Optionale MT-Vorbefüllung (P3 Jonas) — FR-TRAN-009 · Could

1. **Gegeben** ein konfigurierter MT-Provider, **wenn** ich im Editor „Vorübersetzen" wähle,
   **dann** füllt sich der Entwurf maschinell — deutlich als Entwurf markiert; Review-Pflicht
   bleibt unverändert (T-10).
2. **Gegeben** kein Provider konfiguriert (Default), **dann** existiert der Button nicht — der
   Workflow ist ohne KI vollständig nutzbar.
