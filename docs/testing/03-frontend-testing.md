# Frontend-Testing

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Komponenten-Tests (Vitest + Vue Testing Library)

Gilt für `packages/design-system` und Feature-Komponenten in `apps/frontend`.

- **Nutzerzentriert testen:** über Rollen/Labels/Text abfragen (`getByRole('button',
  { name: 'Version publizieren' })`), nicht über CSS-Selektoren/Interna.
- Pflicht je Design-System-Komponente ([DoD-Kriterien](../design-system/03-component-library.md)):
  Verhalten aller Varianten/Zustände, Tastaturbedienung (Tab/Enter/Esc/Pfeile je Pattern),
  Events/v-model, **axe-Check** (`vitest-axe`) über die Kern-Varianten in beiden Themes
  (`data-theme`-Wrapper).
- Fachkomponenten zusätzlich: LirDiffViewer (Diff-Korrektheit, Collapse, Navigation),
  LirMarkdownEditor (Toolbar-Aktionen, Draft-Restore, Upload-Platzhalter),
  LirPermissionEditor (Locked-Keys, Änderungszusammenfassung).

## 2. Stores & Composables

- Pinia-Stores mit `createTestingPinia` bzw. echt + gemocktem API-Client: Zustandsübergänge,
  Fehlerpfade (Problem-Details-Mapping), 401-Behandlung (Redirect + Store-Reset).
- Composables (`useCan`, `useFormErrors`, `useToast`) isoliert; `useCan` ist reine
  Anzeige-Logik — der Test dokumentiert das explizit (Verweis E-Sicherheitsmodell).

## 3. Nuxt-spezifisch

- Routen-Middleware (auth/setup-Redirects) mit `@nuxt/test-utils` (Server-Route-Stubs).
- SSR-Smoke: Artikelseite rendert serverseitig mit Meta/OG/`hreflang` (Unit auf
  Head-Konfiguration + E2E-Absicherung).
- i18n: Key-Paritäts-Check `de`/`en` als Test (fehlende Keys ⇒ rot, NFR-033); Lint gegen
  Hartcode-Strings ergänzt.

## 4. Visuelle Prüfungen (Histoire-basiert)

- Jede Story beider Themes wird im CI gebaut (`histoire build`) — Build-Fehler = Gate.
- Screenshot-Diffs (Playwright über Histoire-Seiten) für die Kernkomponenten-Stories:
  Button, Form-Controls, Modal, Table, Badge/Alert, ArticleViewer-Typografie — Baseline im
  Repo, Diff-Schwelle streng; Änderungen brauchen bewusstes Baseline-Update im PR (verhindert
  schleichende Dark-Mode-Regressionen, E-14-Risiko).

## 5. Was Frontend-Tests NICHT tun

Keine echten API-Aufrufe (Mock über typisierten Client — die Typen stammen aus OpenAPI, daher
bleibt der Mock contract-nah); keine Journey-Simulationen über mehrere Seiten (E2E-Domäne);
keine Snapshot-Tests ganzer Seitenbäume (brüchig, aussagearm).
