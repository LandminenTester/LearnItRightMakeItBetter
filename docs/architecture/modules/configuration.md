# Modul-Landkarte · configuration

**Zweck:** Instanzeinstellungen (typisiertes Settings-Registry, ENV > DB-Präzedenz,
verschlüsselte Secrets), Setup-Wizard-Zustandsmaschine, Modul-Feature-Flags und Branding —
die technische Umsetzung von „Konfiguration statt Editionen"
([ADR-0009](../decisions/adr-0009-single-codebase-no-editions.md)).

## Datenhoheit

`InstanceSetting`, `ModuleFlag`, `SetupState`

## Kanten

| Richtung | Beziehung |
|---|---|
| wird genutzt von | allen Modulen via `ConfigPort.get<T>(key)` und `isModuleEnabled`; `ModuleEnabledGuard` + `SetupGuard` in `common/auth` |
| nutzt | `audit` (alle Änderungen), `media` (Branding-Assets) |
| publiziert | `configuration.settings.changed`, `configuration.module.toggled`, `configuration.setup.completed` |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Registry, Regeln C-1…C-8) | [services/configuration-service.md](../../services/configuration-service.md) |
| Epic + Stories | [E-01 Plattform-Foundation & Setup](../../requirements/epics/e-01-platform-foundation/README.md) |
| Setup-Wizard-Ablauf | [deployment/05 Setup Wizard](../../deployment/05-setup-wizard.md) |
| ENV-Referenz | [deployment/04 Configuration Reference](../../deployment/04-configuration-reference.md) |
| Datenbankschema | [database/schemas/configuration.md](../../database/schemas/configuration.md) |
| API-Endpunkte | [api/endpoints/configuration.md](../../api/endpoints/configuration.md) |
| Secret-Verschlüsselung | [security/04 Data Protection](../../security/04-data-protection-privacy.md) |
