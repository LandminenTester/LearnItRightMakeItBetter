# LirPermissionEditor

**Phase:** 2 · **Kategorie:** Fachkomponenten · **FR:** FR-AUTZ-009 · **Story:** US-14-06 ·
**Fachmodell:** [services/authorization-service.md](../../services/authorization-service.md)

## Zweck

Wiederverwendbare Komponente zum Bearbeiten von Permission-Sets — eingesetzt in der
Rollenverwaltung (Custom-Rollen, Systemrollen-Erweiterung) und der Berechtigungsauskunft
(readonly-Modus). Macht das Permission-Modell (Module → Ressourcen → Aktionen) visuell
verständlich.

## API

```ts
interface LirPermissionEditorProps {
  catalog: PermissionCatalogEntry[]    // aus GET /admin/permissions (Modul, Key, Beschreibung)
  modelValue: string[]                 // ausgewählte Permission-Keys
  lockedKeys?: string[]                // Kern-Permissions von Systemrollen: sichtbar, gesperrt, mit Erklärung (A-3)
  readonly?: boolean                   // Auskunfts-Modus
  originMap?: Record<string, Origin[]> // readonly: Herkunft je Key (Rolle/Gruppe/Policy — FR-AUTZ-010)
  scopeType: ScopeType                 // filtert katalogseitig sinnvolle Permissions
}
// Emits: update:modelValue
```

## Aufbau & Verhalten

- **Gruppierung nach Modul** (einklappbare Sektionen mit Auswahl-Zähler „3/12"), darunter
  Ressourcen-Zeilen mit Aktions-Checkboxen; `manage`-Aktionen visuell abgesetzt
  (implizieren-Warnung: „schließt Rechtevergabe ein").
- **Suchfeld** filtert über Key + Beschreibung (Highlight); Filter „nur ausgewählte".
- **Beschreibungen** aus dem Katalog immer sichtbar (nicht nur Tooltip) — Rechte müssen ohne
  Doku-Studium verständlich sein.
- **Änderungsvorschau:** Fußleiste fasst zusammen („+2 hinzugefügt, −1 entfernt") mit
  Diff-Popover vor dem Speichern (Speichern übernimmt die umgebende Form, nicht die
  Komponente).
- **Gesperrte Keys** (`lockedKeys`): Checkbox disabled + Schloss-Icon + Erklärung
  („Kern-Permission der Systemrolle").
- **Readonly + `originMap`:** statt Checkboxen Herkunfts-Badges je Key (Rolle X / Gruppe Y /
  Policy Z, klickbar zur Quelle) — deckt die Berechtigungsauskunft (US-03-05) ab.

## Sicherheit & Grenzen

Die Komponente ist reine Darstellung/Auswahl — **Durchsetzung passiert serverseitig**
(A-9/A-10; Eskalations-Fehler des Servers werden als Feldfehler der Form angezeigt).
Wildcard-Vergabe (`modul.*`) ist bewusst **nicht** Teil der UI (nur Policies können
Wildcards, Admin-Awareness).

## A11y

Sektionen als Accordion-Pattern; Checkbox-Gruppen mit `fieldset/legend` je Ressource;
Suchergebnis-Anzahl per Live-Region; vollständige Tastaturbedienung; Zähler/Badges mit
Textäquivalent.
