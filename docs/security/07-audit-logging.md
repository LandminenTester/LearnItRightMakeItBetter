# Audit Logging — Verbindlicher Ereigniskatalog

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Technik:** [services/audit-service.md](../services/audit-service.md) ·
**Schema:** [database/schemas/audit.md](../database/schemas/audit.md)

Ereignisformat und Regeln (append-only, keine Secrets, Pseudonymisierung) definiert der
Audit-Service. Dieser Katalog legt fest, **was** protokolliert wird. „Pflicht" = Testsuite
erzwingt Erzeugung (AU-3). „Erweitert" = nur bei aktiviertem erweitertem Katalog (FR-AUDT-006).

## Basiskatalog (Phase 1, Pflicht)

### Authentifizierung (`auth.*`)

| Action | Severity | Metadata (Auszug) |
|---|---|---|
| `auth.login.succeeded` / `failed` | info / notice | method (local/provider/pat), provider? |
| `auth.logout` | info | |
| `auth.session.revoked` | notice | revokedBy (self/admin/system), sessionId |
| `auth.password.changed` / `reset_requested` / `reset_completed` | notice | |
| `auth.email.change_requested` / `changed` | notice | |
| `auth.mfa.enabled` / `disabled` | notice | type |
| `auth.mfa.recovery_code_used` | **warning** | remainingCodes |
| `auth.identity.linked` / `unlinked` | notice | provider |
| `auth.pat.created` / `revoked` / `used_denied` | notice | scopes, tokenPrefix |
| `auth.lockout.triggered` | warning | Fehlversuchszähler |

### Konten & Rechte (`identity.*`, `authz.*`)

| Action | Severity | Metadata |
|---|---|---|
| `identity.user.registered` | info | via, invitedBy? |
| `identity.user.suspended` / `reactivated` | **warning** | actor, reason |
| `identity.user.deleted` | **warning** | initiator (self/admin), Vier-Augen-Referenz |
| `identity.invitation.created` / `revoked` | info | |
| `identity.provider.created` / `updated` / `deleted` / `toggled` | **warning** | providerSlug, geänderte Felder (ohne Secrets) |
| `authz.role.created` / `updated` / `deleted` | notice | Vorher/Nachher Permission-Diff |
| `authz.assignment.created` / `removed` | notice | principal, role, scope |
| `authz.group.membership_changed` | notice | |
| `authz.policy.created` / `updated` / `deleted` / `toggled` | **warning** | Policy-Diff |
| `authz.escalation.blocked` | **warning** | versuchte Zuweisung (A-10) |

### Setup, Konfiguration, Betrieb (`setup.*`, `config.*`, `system.*`)

| Action | Severity | Metadata |
|---|---|---|
| `setup.step.completed` / `setup.completed` | notice | step |
| `setup.access_denied` | **warning** | Pfad, IP (US-01-05) |
| `config.setting.changed` | notice | key, Vorher/Nachher (Secrets: nur `changed: true`) |
| `config.module.toggled` | **warning** | module, enabled |
| `recovery.cli.executed` | **critical** | Kommando, reason (US-13-03) |
| `recovery.emergency_admin.created` / `expired` | **critical** | reason, expiresAt |
| `system.job.dead_letter` / `retried` / `discarded` | warning | queue, jobId |
| `audit.retention.executed` / `audit.export.created` | info / notice | Zeitraum, Anzahl / Filter |

### Inhalte — sicherheitsrelevante Teilmenge (Pflicht)

| Action | Severity | Metadata |
|---|---|---|
| `knowledge.article.moderated` (Depublikation) | **warning** | reason (K-13) |
| `knowledge.comment.deleted_by_moderator` | notice | |
| `media.object.rejected` | **warning** | Grund (Magic Bytes/Bombe), Uploader |
| `profile.reputation.adjusted` | notice | ±points, reason (P-1) |
| `repository.project.moderated` | notice | |

## Erweiterter Katalog (Phase 3, opt-in)

Vollständiger Content-Lifecycle (`article.created/submitted/published/archived`,
`translation.*`), Org-Lebenszyklus (`organization.*` inkl. Mitgliederwechsel), Space-/
Kategorie-Änderungen, Einstellungen aller Nutzer (Präferenzen), Exporte. Zweck:
Enterprise-Governance; Severity überwiegend `info`.

## Abgrenzung

Kein Audit für: Lesezugriffe (außer Audit-Export selbst), UI-Navigation, fachliche
Normalvorgänge im Basiskatalog (Kommentar erstellt etc.) — dafür sind Domain Events/Logs da.
Der Katalog wächst nur über PR + Security-Review (Log-Inflation vermeiden, E-12-Risiko).
