# ADR-0002: Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS 4 als Frontend-Stack

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Das Frontend muss öffentliche SEO-relevante Seiten (Artikel, FR-PLAT-004), hochinteraktive
App-Bereiche (Editor, Reviews) und Admin-Oberflächen abdecken — mit einem Design System als
einziger UI-Quelle (FR-PLAT-007) und Dark Mode (FR-PLAT-001). Das Fachkonzept (§7) legt
Nuxt 3, Vue 3, TypeScript und Tailwind CSS 4 fest.

## Entscheidung

**Eine** Nuxt-3-Anwendung für alle Oberflächen, mit routen-basierter Rendering-Strategie
(SSR für öffentliche Inhalte, SPA für `/app`, `/admin`, `/setup`). Vue 3 Composition API mit
`<script setup lang="ts">`, Pinia für State, Tailwind CSS 4 auf Basis der Design Tokens
(CSS Variables) aus `packages/design-system`.

## Betrachtete Alternativen

- **Getrennte Apps (Public-Site + Dashboard)** — abgelehnt: doppelte Auth-/i18n-/Design-Anbindung,
  mehr Deployment-Teile; `routeRules` löst das Rendering-Problem in einer App.
- **React/Next.js** — abgelehnt: Konzeptvorgabe Vue-Ökosystem; kein fachlicher Vorteil, der den
  Bruch rechtfertigt.
- **Klassisches SSR-Templating aus dem Backend** — abgelehnt: Editor-/Review-UIs erfordern
  App-Charakter.

## Konsequenzen

- ✅ SEO + App-Erlebnis in einer Codebasis; ein i18n-, ein Auth-, ein Design-System-Setup.
- ✅ Nitro-Server ermöglicht BFF-Proxy (Same-Origin-Cookies) und Sitemap-Generierung.
- ⚠️ SSR-Pfade müssen Session-Cookies korrekt durchreichen und dürfen keine nutzerbezogenen
  Antworten cachen (→ [03-frontend-architecture.md](../03-frontend-architecture.md)).
- ⚠️ Upgrade-Pfad Richtung Nuxt 4 wird beobachtet; ein Wechsel erfolgt als eigener ADR mit
  Migrationsplan.
