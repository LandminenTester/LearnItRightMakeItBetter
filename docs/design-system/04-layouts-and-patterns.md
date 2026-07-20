# Layouts & Patterns

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Shells (`layouts/`)

| Shell | Verwendung | Aufbau |
|---|---|---|
| `LirPublicShell` | öffentliche Seiten (Artikel, Spaces, Profile, Projekte, Suche) | Topbar (Logo, Suche, Sprach-/Theme-Switch, Login/Avatar) · Inhalt · Footer (Instanz-Links, Lizenzhinweis CC BY-SA) |
| `LirAppShell` | angemeldeter Bereich `/app` | Topbar + einklappbare Sidebar (Navigation, Review-Queues mit Zählern) · Inhalt · Notification-Glocke |
| `LirAdminShell` | `/admin` | wie AppShell mit Admin-Navigation (gruppiert nach Modulen), Umgebungs-Badge |
| `LirSetupShell` | `/setup` | zentrierter Stepper (LirStepper) ohne Navigation |
| `LirMinimalShell` | Login/Registrierung/Fehlerseiten | zentrierte Karte, Instanz-Branding |

Alle Shells: Skip-Link als erstes fokussierbares Element, `<main>`-Landmark,
Breakpoint-Verhalten (Sidebar → Drawer unter `lg`).

## 2. Seiten-Patterns

### Artikel-Leseseite (wichtigste Seite der Plattform)

Meta-Leiste (Typ-Badge, Space-Breadcrumb, Sprache/hreflang-Switcher, Version + Datum,
Autoren/Übersetzer-Attribution) → Statusbanner-Zone (Outdated T-4 / Archiviert K-12 /
In-Review-Hinweis für Berechtigte) → `LirArticleViewer` mit TOC (ab 3 Überschriften, sticky
ab `lg`) → Feedback-Zeile (Hilfreich-Frage) → Kommentar-Bereich (einklappbar).

### Listen-/Verwaltungsseiten (Admin, Reviews, eigene Inhalte)

Kopf (Titel + Primäraktion rechts) → Filterleiste (Suche + Facetten-Selects, URL-synchron) →
`LirTable`/Kartenliste → Cursor-Pagination. Bulk-Aktionen nur wo spezifiziert, mit
Auswahl-Zusammenfassung.

### Detail-/Editor-Seiten

Zweispaltig ab `lg` (Inhalt + Meta-Sidebar: Status, Aktionen, Historie); Editor-Seiten mit
persistenter Aktionsleiste (Speichern/Einreichen + Statusanzeige „gespeichert").

## 3. Formular-Patterns

- Jedes Feld in `LirFormField` (Label, optionaler Hinweis, Fehlertext, `aria-describedby`
  verdrahtet); Pflichtfelder markiert, Optionales als „(optional)".
- Validierung: on-blur + on-submit; Serverfehler (422) mappen auf Felder, nicht nur als
  globale Meldung; Submit-Button mit `loading`-Zustand, Doppel-Submit-Schutz.
- Zerstörerische Aktionen: `LirConfirmDialog` mit Konsequenzbeschreibung; bei irreversiblen
  (Org-Löschung O-6) zusätzlich Namensbestätigung; Re-Auth-Flows als eigenes Dialog-Pattern
  (I-15).
- Mehrschritt (Setup Wizard): `LirStepper`, jeder Schritt einzeln validier- und wiederholbar,
  Zustand serverseitig (C-4).

## 4. Zustands-Patterns (verbindlich für jede Datenansicht)

| Zustand | Pattern |
|---|---|
| Laden | `LirSkeleton` in Ziel-Layoutform (Listen: Zeilen; Artikel: Textblöcke); Spinner nur für Aktionen < 1 s |
| Leer | `LirEmptyState`: Illustration/Icon + Erklärung + nächster Schritt als Aktion („Ersten Artikel erstellen") |
| Fehler | `LirAlert` mit Ursache + Wiederholen-Aktion; Seitenebene: Fehlerseiten-Pattern |
| Teilausfall | degradierte Bereiche gekennzeichnet (z. B. Suche offline S-6), Rest bleibt nutzbar |

Fehlerseiten (404/403/500, Modul deaktiviert): `LirMinimalShell`, klare Erklärung,
Zurück-/Start-Aktionen; 404 verrät nichts über Existenz (E-Sicherheitsregel).

## 5. Weitere verbindliche Muster

- **Statusanzeige:** Lifecycle-Status immer als `LirBadge` mit konsistenter Farb-/
  Textzuordnung (draft=neutral, in_review=info, published=success, outdated=warning,
  archived=muted) — plattformweit identisch.
- **Zeitangaben:** relative Zeit („vor 3 Std.") mit absolutem Titel-Tooltip; Datumsformat
  locale-abhängig.
- **Attribution:** Personen immer als `LirUserRef` (Avatar + Handle, verlinkt);
  gelöschte Nutzer als neutraler Platzhalter („Gelöschtes Mitglied").
- **Notifications:** `LirToast` für Aktions-Feedback (auto-dismiss 5 s, Fehler persistent);
  Glocke + `LirNotificationList` für In-App (E-11).
- **Command Palette:** globales Overlay (Cmd/Ctrl+K), Gruppierung wie US-06-04.
