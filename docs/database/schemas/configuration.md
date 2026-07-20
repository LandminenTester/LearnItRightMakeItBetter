# Schema · configuration

**Spezifikation:** [services/configuration-service.md](../../services/configuration-service.md) ·
**Landkarte:** [architecture/modules/configuration.md](../../architecture/modules/configuration.md)

## instance_settings

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| key | String | PK | Registry-Schlüssel (`smtp.host`, `policy.registrationMode`, …) — nur registrierte Keys (C-1) |
| value | Json | NOT NULL | Zod-validiert gegen Registry-Schema |
| encrypted | Boolean | default false | bei true: `value` = Base64 von `keyId‖nonce‖ciphertext‖tag` (C-3) |
| updatedById | uuid? | FK→users SetNull | |

## module_flags

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| module | Enum `ToggleableModule` | PK | `organization` \| `translation` \| `repository` \| `comments` \| `achievements` |
| enabled | Boolean | NOT NULL | Kernmodule erscheinen hier nicht (C-7) |
| updatedById | uuid? | FK SetNull | |

## setup_state (Singleton — eine Zeile, App-erzwungen)

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | Int | PK, CHECK (id = 1) | Singleton |
| completedAt | DateTime? | | irreversibel via Web (C-4/C-5) |
| currentStep | Enum `SetupStep` | NOT NULL | `system` → `database` → `storage` → `oauth` → `security` → `admin` → `recovery` → `done` |
| stepResults | Json | default `{}` | letzter Check-Status je Schritt (US-01-01) |
| wizardVersion | String | NOT NULL | für spätere Wizard-Migrationen |
