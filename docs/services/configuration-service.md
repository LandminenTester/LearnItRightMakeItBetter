# Configuration Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-CONF-001…007 · **Epic:** [E-01](../requirements/epics/e-01-platform-foundation/README.md) ·
**Schema:** [database/schemas/configuration.md](../database/schemas/configuration.md)

## 1. Zweck & Verantwortlichkeiten

- **Instanzeinstellungen** (typisiertes Settings-Registry, DB-gestützt, gecacht)
- **Setup Wizard**: Zustandsmaschine, Checks, Admin-Erstellung, Recovery-Setup
  (Ablauf → [deployment/05](../deployment/05-setup-wizard.md))
- **Modul-Aktivierung** (Feature-Flags) inkl. `ModuleEnabledGuard`-Datenquelle
- **Branding** (Name, Logo, Farben im erlaubten Rahmen, Standardsprachen/-theme)
- **Secret-Verschlüsselung** für Konfigurationswerte (SMTP-Passwort, OAuth-Secrets, Tokens)
- Konfigurations-**Präzedenz ENV > DB** mit Herkunfts-Transparenz

## 2. Abgrenzung

Infrastruktur-ENV-Validierung beim Start liegt in `common/config`
([architecture/04 §5](../architecture/04-backend-architecture.md)); dieses Modul verwaltet
**fachliche Laufzeit-Einstellungen** und den Setup-Zustand. Provider-Detailkonfiguration
(OAuth) gehört `identity` — `configuration` liefert nur den generischen, verschlüsselten
Settings-Speicher.

## 3. Domänenmodell

- `InstanceSetting` — `key` (Registry-Schlüssel, z. B. `smtp.host`,
  `policy.registrationMode`), `value` (JSONB), `encrypted` (bool), `updatedById`, `updatedAt`.
- `ModuleFlag` — `module` (`organization`|`translation`|`repository`|`comments`|`achievements`),
  `enabled`, `updatedById`.
- `SetupState` — Singleton: `completedAt?`, `currentStep`, `stepResults` (JSONB je Check),
  `wizardVersion`.

## 4. Fachliche Regeln

- **C-1:** **Settings-Registry im Code**: Jeder Key ist mit Zod-Schema, Default, Kategorie,
  `encrypted`-Flag und Beschreibung registriert (`packages/shared-types`). Unbekannte Keys
  werden nicht akzeptiert; die Admin-UI rendert generisch aus der Registry.
- **C-2:** Präzedenz (FR-CONF-006): existiert eine korrespondierende ENV-Variable
  (Mapping in der Registry), gewinnt sie; die UI zeigt den Wert schreibgeschützt mit Herkunft
  „ENV". DB-Werte greifen ohne Neustart (Cache-Invalidierung via
  `configuration.settings.changed`).
- **C-3:** Verschlüsselung (FR-CONF-007): `encrypted`-Keys werden mit AES-256-GCM
  (`APP_ENCRYPTION_KEY`, Key-Ableitung + Key-ID für Rotation) gespeichert; Lese-API liefert
  nie Klartext an die UI (nur `isSet: true` + Ersetzen-Aktion)
  (→ [security/04](../security/04-data-protection-privacy.md)).
- **C-4:** Setup-Zustandsmaschine: Schritte `system → database → storage → oauth (optional) →
  security → admin → recovery → done`; jeder Schritt einzeln wiederholbar; `done` setzt
  `completedAt` **irreversibel** (Web-seitig; CLI-Reset → E-13).
- **C-5:** Vor `completedAt` gilt global: nur Setup-Endpoints + Health erreichbar
  (`SetupGuard`); danach sind Setup-Endpoints gesperrt + auditiert (US-01-05).
- **C-6:** Security-Defaults-Schritt erzwingt: HTTPS-Erreichbarkeit der `APP_URL`
  (Warnung bei http außer localhost), starke Session-/Encryption-Secrets (Entropie-Check),
  Registrierungsmodus bewusst gewählt.
- **C-7:** Modul-Flags wirken über den `ModuleEnabledGuard` (404 `module_disabled`) und
  schalten Event-Handler/Jobs no-op (→ [architecture/02 §7](../architecture/02-module-boundaries.md));
  Flag-Änderungen sind auditiert.
- **C-8:** Branding-Assets laufen über `media` (`kind = branding`, MD-1); Farbanpassungen
  beschränken sich auf die Branding-Token-Slots des Design Systems
  (→ [design-system/02](../design-system/02-design-tokens.md)).

## 5. Schnittstellen

**API (Auszug):** `/setup/*` (Status, Checks je Schritt, Admin-Erstellung — nur vor Abschluss),
`/admin/settings` (Registry-basiert, Kategorien), `/admin/modules`, `/instance/meta`
(öffentlich: Name, Branding, aktive Module, verfügbare Login-Provider — für Frontend-Bootstrap).

**Publizierte Events:** `configuration.settings.changed` (key, Kategorie),
`configuration.module.toggled`, `configuration.setup.completed`.

**Ports:** `ConfigPort.get<T>(key)` (typisiert, gecacht — von allen Modulen genutzt),
`ConfigPort.isModuleEnabled(module)`.

## 6. Hintergrundjobs

Keine eigenen.

## 7. Konfiguration (ENV-Bootstrap)

`APP_URL`, `APP_ENCRYPTION_KEY`, `SESSION_SECRET`, `DATABASE_URL`, `REDIS_URL`, `MEILI_*`,
`STORAGE_*`, optional `SMTP_*` u. a. — vollständiger Katalog:
[deployment/04](../deployment/04-configuration-reference.md).

## 8. Sicherheit

Settings-Endpoints erfordern `configuration.settings.manage` (nur `platform.admin`-Systemrolle);
Secrets nie im Klartext lesbar (C-3); Setup-Guard-Logik ist Teil der kritischen Testpfade
(NFR-042). `/instance/meta` gibt ausschließlich unkritische, öffentliche Werte preis
(Review-Pflicht bei Erweiterung).

## 9. Offene Punkte

- Konfigurations-Export/-Import (Instanz-Migration) — nach 1.0.
- Mehrsprachiges Branding (Name je Sprache) — bei Bedarf.
