# Coding Standards

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. TypeScript (überall)

- `strict: true` inkl. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; Ziel ES2023.
- **Kein `any`** — Lint-Fehler; unvermeidbare Fälle (defekte Fremdtypen) mit `// any-reason:`
  + Issue-Link. Kein `// @ts-ignore` (`@ts-expect-error` mit Begründung, wenn je nötig).
- `unknown` an Systemgrenzen + Zod-Parse; Type Assertions (`as`) nur nach Laufzeitprüfung.
- Nullhandling explizit (`??`, Guard-Clauses) — keine non-null-Assertions `!` außerhalb von
  Tests.
- Benennung: `camelCase` Werte/Funktionen, `PascalCase` Typen/Klassen/Komponenten,
  `SCREAMING_SNAKE` echte Konstanten; sprechende Namen > Kürze; Dateinamen `kebab-case`
  (Vue-Komponenten `PascalCase.vue`).
- Sprache im Code: **Englisch** (Bezeichner, Commit-Subjects); Kommentare/Doku **Deutsch**.
- Kommentare erklären *Warum* und Invarianten (mit Regel-IDs: `// K-7: Konfliktwarnung …`),
  nie das *Was* der nächsten Zeile; kein auskommentierter Code (Git erinnert sich).

## 2. Backend (NestJS) — ergänzt [architecture/04](../architecture/04-backend-architecture.md)

- Schicht-Regeln B-1…B-5 + Modul-Regeln M-1…M-7 sind Lint-erzwungen (dependency-cruiser,
  eslint-no-restricted-imports).
- Guard-Clauses/frühe Returns statt Verschachtelung; Funktionen fokussiert (Richtwert ≤ 40
  Zeilen — Abweichung ok mit Grund, kein Dogma).
- **Fehlerbehandlung:** typisierte Domain-Exceptions (B-4); `try/catch` nur an definierten
  Grenzen (Adapter zu Fremd-Systemen, Job-Handler-Wrapper) — Validierung verhindert
  Fehlerfälle, statt sie zu schlucken; catch-and-ignore ist verboten (mindestens Log +
  Kontext).
- **Logging:** strukturiert über den Modul-Logger (`this.logger.info({ articleId }, 'msg')`);
  Level: `error` = Handlungsbedarf, `warn` = auffällig, `info` = fachlicher Meilenstein,
  `debug` = Entwicklung. Redaction-Liste beachten (security/04 §4); kein `console.*`.
- Zeit/IDs/Zufall über injizierte Provider (`Clock`, `IdGenerator`) — Testbarkeit.
- Konstanten/Limits aus `shared-types`-Konfigurationen bzw. Settings-Registry — keine Magic
  Numbers im Fachcode.

## 3. Frontend (Vue/Nuxt) — ergänzt [architecture/03](../architecture/03-frontend-architecture.md)

- `<script setup lang="ts">` überall; Props/Emits typisiert; Composition API (keine
  Options-API-Neuzugänge).
- Regeln F-1…F-5 (API-Client-Zwang, Store-Wahrheit, i18n, Design-System) — Lint-erzwungen wo
  möglich ([design-system/06 §-Durchsetzung](../design-system/06-agentic-ui-rules.md)).
- Composables für Logik, Komponenten für Darstellung; Props runter, Events hoch — kein
  Store-Schreiben aus tiefen Präsentationskomponenten.
- Template-Komplexität: berechnete Werte in `computed`, keine verschachtelten Ternaries im
  Template.

## 4. Werkzeuge & Formatierung

- **ESLint** (typescript-eslint, vue, security-Plugins + Eigenregeln) und **Prettier**
  (Repo-Konfiguration; 100 Zeichen, Single Quotes, keine Semikolon-Debatten — Prettier
  entscheidet). Stylelint für die wenigen CSS-Dateien des Design Systems.
- Konfigurationen leben im Root und werden nicht paketweise aufgeweicht.
- Editor: `.editorconfig` + empfohlene VS-Code-Extensions (`.vscode/extensions.json`).
- `pnpm verify` bündelt lint+typecheck+unit+build — lokal grün vor jedem PR (Pflicht).

## 5. Abhängigkeits-Disziplin

Neue Runtime-Dependency ⇒ PR-Begründung (Bedarf, Alternativen, Wartungszustand, Größe,
Lizenz-Allowlist NFR-070); Wrapper/Adapter, wenn die Lib an eine austauschbare Grenze gehört
(NFR-044). Utility-Kleinstpakete (left-pad-Klasse) werden nachgebaut statt installiert.
