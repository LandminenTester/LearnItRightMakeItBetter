# Designprinzipien

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Haltung

*Learn it right. Make it better.* ist ein **Arbeitswerkzeug für Entwickler**: ruhig, präzise,
inhaltszentriert. Die UI tritt hinter das Wissen zurück — Dichte und Klarheit schlagen
Dekoration.

| Prinzip | Bedeutung konkret |
|---|---|
| **Inhalt zuerst** | Artikel-Lesefluss ist die wichtigste Oberfläche; großzügige Lesebreite (~72ch), ruhige Typografie, Code als Bürger erster Klasse |
| **Vertrauen durch Klarheit** | Status (Review, Outdated, Archiviert) immer sichtbar als Badge/Banner — nie versteckt; destruktive Aktionen unmissverständlich |
| **Effizienz für Power-User** | Tastaturwege (Cmd/Ctrl+K, Formular-Shortcuts), kompakte Tabellen im Admin, keine unnötigen Bestätigungs-Hürden bei reversiblen Aktionen |
| **Ruhige Zustände** | Skeletons statt Spinner-Kaskaden; Leerzustände erklären den nächsten Schritt; Fehler benennen Ursache + Ausweg |
| **Eine Plattform, viele Instanzen** | Neutrale, professionelle Grundästhetik; Instanz-Branding (Logo, Akzentfarbe) besetzt definierte Slots, ohne das System zu brechen |

## 2. Gestaltungssprache

- **Layout:** klare Flächenhierarchie (Hintergrund → Fläche → erhabene Fläche), 8-px-Raster,
  Container-Breiten je Kontext (Lesen schmal, Admin breit).
- **Typografie:** UI-Sans (Inter o. vergleichbar, self-hosted), Mono für Code (JetBrains Mono
  o. vergleichbar); Skala in [02-design-tokens.md](02-design-tokens.md); keine Font-CDNs
  (Privacy, security/04 §5).
- **Farbe:** zurückhaltende Neutralpalette + eine Akzentfarbe (Branding-Slot) + semantische
  Farben (success/warning/danger/info). Farbe kodiert Bedeutung, nie Dekoration allein
  (A11y: nie Farbe als einziger Träger).
- **Ikonografie:** ein Icon-Set (Lucide), Standardgrößen 16/20/24, immer mit Label oder
  `aria-label`.
- **Motion:** funktional und kurz (100–200 ms, Token-gesteuert); `prefers-reduced-motion`
  respektiert; keine dekorativen Dauer-Animationen.

## 3. Ton & Texte (UI-Copy)

- Deutsch/Englisch gemäß UI-Locale; direkt und respektvoll („Du"-Form in `de`, konsistent).
- Aktionsbeschriftungen benennen die Wirkung („Version publizieren", nicht „OK").
- Fehlertexte: was ist passiert → was kann ich tun; keine Schuldzuweisung, kein Fachjargon
  ohne Not.
- Statusbegriffe folgen dem [Glossar](../requirements/07-glossary.md) — UI, Doku und API
  sprechen dieselbe Sprache.

## 4. Marken-Neutralität & Instanz-Branding

Das Design System liefert eine markenneutrale Basis (Trademark Policy bleibt außen vor).
Instanzen dürfen anpassen: Logo, Akzentfarbe (`--lir-color-accent-*`-Slots), Login-Hintergrund,
Name. Nicht anpassbar ohne Fork: Komponentenanatomie, semantische Farben, Spacing-System —
das sichert Wiedererkennbarkeit von Doku/Screenshots über Instanzen hinweg.
