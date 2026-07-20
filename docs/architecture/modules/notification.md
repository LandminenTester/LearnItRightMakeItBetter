# Modul-Landkarte · notification

**Zweck:** Zustell-Service für alle Kanäle — konfigurierbares SMTP (Templates MJML,
Branding, i18n), In-App-Benachrichtigungen mit Präferenzmatrix und Deduplizierung,
Watch-Mechanik, vorbereitete signierte Webhooks (Phase 3).

## Datenhoheit

`Notification`, `NotificationPreference`, `Watch`, `EmailLog`, `WebhookEndpoint` (Phase 3)

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity` (`getNotificationTarget`: E-Mail + Locale), `configuration` (SMTP/Branding), `audit` |
| konsumiert Events | nahezu alle (`review.requested`, `knowledge.*`, `translation.*`, `organization.*`, `profile.achievement.awarded`, `identity.mfa.*`, `repository.sync.failed`, `system`-Warnungen) — Katalog in der Spezifikation |
| wird genutzt von | Fachmodulen nur über den schmalen `dispatch`-Port (Regel M-4) |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Ereigniskatalog, Regeln N-1…N-7) | [services/notification-service.md](../../services/notification-service.md) |
| Epic + Stories | [E-11 Notifications](../../requirements/epics/e-11-notifications/README.md) |
| Datenbankschema | [database/schemas/notification.md](../../database/schemas/notification.md) |
| API-Endpunkte | [api/endpoints/notification.md](../../api/endpoints/notification.md) |
| Realtime-Vorbereitung | [api/04 Realtime & Events](../../api/04-realtime-and-events.md) |
