# Frontend-Architektur (Nuxt 3)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Überblick

Das Frontend ist **eine** Nuxt-3-Anwendung (`apps/frontend`) für alle Oberflächen: öffentliche
Seiten, Dashboard, Administration und Community-Bereiche. Vue 3 (Composition API,
`<script setup lang="ts">`), TypeScript strict, Tailwind CSS 4, Komponenten ausschließlich aus
`packages/design-system` (→ [design-system/](../design-system/README.md)).

## 2. Rendering-Strategie

| Bereich | Route-Muster | Modus | Begründung |
|---|---|---|---|
| Öffentliche Inhalte (Artikel, Spaces, Profile, Projekte, Org-Seiten, Suche) | `/`, `/a/**`, `/s/**`, `/u/**`, `/p/**`, `/o/**`, `/search` | **SSR** (+ SWR-Caching für anonyme Antworten) | SEO (FR-PLAT-004), schnelle First Paints |
| Angemeldeter App-Bereich (Editor, Reviews, Übersetzungen, Einstellungen) | `/app/**` | **SPA** (`ssr: false` via `routeRules`) | Interaktiv, kein SEO-Bedarf, entlastet Server |
| Administration | `/admin/**` | **SPA** | wie App-Bereich |
| Setup Wizard | `/setup/**` | **SPA** | läuft vor fertiger Konfiguration |

`routeRules` in `nuxt.config.ts` sind die einzige Stelle, an der Rendering-Modi definiert werden.

## 3. Verzeichnisstruktur `apps/frontend/`

```
apps/frontend/
├── nuxt.config.ts
├── app.vue
├── layouts/                -- default (öffentlich), app, admin, setup, minimal (Auth-Seiten)
├── pages/                  -- Dateibasierte Routen gemäß Tabelle oben
├── components/             -- NUR seitenspezifische Kompositionen;
│                              Basis-/Muster-Komponenten kommen aus dem Design System
├── composables/            -- useApi, useAuth, useCan, useInstanceConfig, useLocale, ...
├── stores/                 -- Pinia: ein Store pro fachlichem Bereich (auth, notifications,
│                              editor, admin, search, setup)
├── middleware/             -- auth.global.ts (Session/Guards), setup.global.ts (Wizard-Redirect)
├── plugins/                -- api-client, design-system, error-reporting
├── i18n/                   -- UI-Locales de.json, en.json (getrennt vom Content-System)
├── server/                 -- Nuxt-Nitro: BFF-Proxy /api → Backend, Sitemap, robots.txt
└── utils/
```

**Regeln:**

- **F-1 (MUSS):** Kein direkter `fetch`-Aufruf in Komponenten. Alle API-Zugriffe laufen über den
  generierten, typisierten API-Client (`composables/useApi`), dessen Typen aus der OpenAPI-Spec
  stammen (→ [api/05](../api/05-openapi-workflow.md)).
- **F-2 (MUSS):** Pinia-Stores sind die Quelle der Wahrheit für geteilten Client-State; kein
  paralleler lokaler State für Daten, die im Store liegen.
- **F-3 (MUSS):** UI-Texte ausschließlich über i18n-Keys (NFR-033).
- **F-4 (MUSS):** Neue wiederverwendbare UI-Bausteine entstehen im Design System, nie in
  `apps/frontend/components` (→ [design-system/06](../design-system/06-agentic-ui-rules.md)).
- **F-5 (SOLLTE):** Seiten bleiben Kompositionsschicht: Datenbeschaffung (`useAsyncData` +
  API-Client), Store-Anbindung, Layout — Fachlogik gehört in Composables.

## 4. API-Anbindung & Auth im Frontend

- **Same-Origin-Betrieb:** Der Reverse Proxy (bzw. Nitro-Proxy in Dev) mappt `/api/**` auf das
  Backend — Cookies laufen als First-Party, kein CORS im Standard-Deployment.
- **Session-Cookie:** HTTP-only; das Frontend liest nie Tokens. Der Login-Zustand kommt von
  `GET /api/v1/auth/session` (hydratisiert den `auth`-Store bei SSR und App-Start).
- **SSR-Requests** reichen das Session-Cookie des Nutzers an das Backend weiter
  (`useRequestHeaders(['cookie'])` im API-Client-Plugin).
- **CSRF:** Double-Submit-Token; der API-Client hängt den Header automatisch an
  (→ [security/05](../security/05-application-security.md)).
- **Berechtigungen in der UI:** `useCan(permission, scope?)` prüft gegen die von
  `/auth/session` gelieferten effektiven Permissions — **nur** für Anzeige-Entscheidungen;
  die verbindliche Prüfung ist immer serverseitig (→ [security/03](../security/03-authorization-enforcement.md)).
- **401-Behandlung:** zentral im API-Client — Store leeren, Redirect auf Login mit `returnTo`.

## 5. Fehler-, Lade- und Leerzustände

- Fehlerseiten (404/403/500) und Zustands-Patterns kommen aus dem Design System
  (→ [design-system/04](../design-system/04-layouts-and-patterns.md)).
- Jede Datenansicht definiert die vier Zustände laden/leer/Fehler/Inhalt; Skeletons statt
  Spinner für Listen und Artikel.
- API-Fehler (Problem Details, → [api/01](../api/01-api-conventions.md)) werden zentral in
  nutzerverständliche i18n-Meldungen übersetzt; Feldfehler landen an den Formularfeldern.

## 6. Performance-Vorgaben

- Route-Level Code-Splitting (Nuxt-Standard) + gezielte `defineAsyncComponent` für schwere
  Bausteine (Markdown-Editor, Diff-Viewer, Permission-Editor).
- Bilder ausschließlich über die Media-Varianten des Backends (`srcset`), keine Original-Uploads
  im Layout.
- Budgets und Messung (Lighthouse CI): → [testing/05](../testing/05-quality-gates-performance.md),
  Zielwerte NFR-005.

## 7. Theming & Dark Mode

- Theme-Umschaltung via `data-theme` auf `<html>`; Tokens als CSS-Variablen
  (→ [design-system/02](../design-system/02-design-tokens.md)).
- FOUC-Vermeidung: Inline-Snippet im `<head>` liest Nutzerwahl (Cookie) bzw.
  `prefers-color-scheme`, bevor CSS angewendet wird (US-14-02).
