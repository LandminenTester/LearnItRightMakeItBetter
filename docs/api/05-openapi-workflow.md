# OpenAPI-Workflow

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Code-first mit Zod als Quelle

```
packages/shared-types (Zod-Schemas der DTOs + Error-Codes + Enums)
        │  (import)
apps/backend: Controller + nestjs-zod → OpenAPI 3.1 Spec
        │  (generate)
/api/v1/openapi.json  +  Artefakt openapi.json im Build
        │  (openapi-typescript / Client-Gen)
apps/frontend: typisierter API-Client (composables/useApi)
```

- **Eine Wahrheit:** Request-/Response-Schemas existieren genau einmal — als Zod-Schema in
  `packages/shared-types`. Backend validiert damit (Regel B-3), OpenAPI wird daraus generiert,
  der Frontend-Client-Typ ebenso. Handgeschriebene Duplikat-Interfaces sind verboten.
- Jeder Controller-Handler trägt: Operation-ID (`knowledge_publishArticle`), Tags (Modulname),
  Permission-Deklaration (erscheint als `x-required-permission` in der Spec),
  Fehler-Codes (`x-error-codes`).

## 2. Bereitstellung

| Artefakt | Ort |
|---|---|
| Maschinenlesbar | `GET /api/v1/openapi.json` (öffentlich; enthält keine internen Endpunkte des Setup vor Abschluss) |
| Interaktive Doku | `GET /api/docs` (Scalar/Swagger-UI), per Instanzeinstellung abschaltbar |
| Build-Artefakt | `openapi.json` im CI-Artefakt je Release (Diff-Grundlage) |

## 3. CI-Prüfungen (Quality Gates)

1. **Spec-Build:** Backend bootet im Spec-Modus; Generierung schlägt fehl bei Handlern ohne
   Operation-ID/Tags/Permission-Deklaration (außer `@Public()`).
2. **Breaking-Change-Diff:** `openapi-diff` gegen die Spec des letzten Release-Tags — brechende
   Änderungen an v1 lassen die Pipeline scheitern (Ausnahme nur mit
   `api-breaking-approved`-Label + Begründung, vor 1.0 erlaubt).
3. **Katalog-Abgleich:** Skript prüft, dass jeder Endpunkt der Spec in
   [endpoints/](endpoints/README.md) dokumentiert ist (Pfad+Methode-Abgleich) — verhindert
   Doku-Drift.
4. **Client-Sync:** Der generierte Frontend-Client wird im CI frisch erzeugt und mit dem
   eingecheckten Stand verglichen (kein veralteter Client auf `main`).

## 4. Client-Nutzung im Frontend

- Generierung: `pnpm gen:api` (openapi-typescript → `packages/shared-types/src/api-client/`).
- `useApi()` wrappt den generierten Client: Cookie-/CSRF-Handling, 401-Redirect,
  Problem-Details-Mapping auf i18n (→ [architecture/03 §4–5](../architecture/03-frontend-architecture.md)).
- Verbot: `fetch`/`$fetch` direkt in Komponenten (Regel F-1).

## 5. Externe API-Konsumenten

Für Integrationen (PATs): die veröffentlichte `openapi.json` ist der Vertrag; Versionierung
und Deprecation-Politik → [01-api-conventions.md §8](01-api-conventions.md). Ein offizielles
SDK ist nicht Teil von 1.0 (die Spec ermöglicht Generierung durch Nutzer).
