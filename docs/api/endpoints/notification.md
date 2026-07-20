# API · notification

**Fachregeln:** [services/notification-service.md](../../services/notification-service.md) ·
**Stories:** [E-11](../../requirements/epics/e-11-notifications/user-stories.md)

## In-App

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/notifications` | auth | Eigene Benachrichtigungen (Cursor; Filter: unread, type) |
| GET | `/notifications/unread-count` | auth | Zähler (Polling-Endpunkt, ETag-fähig) |
| POST | `/notifications/:id/read` · `/notifications/read-all` | auth | Als gelesen markieren |

## Präferenzen & Watches

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/PUT | `/users/me/notification-preferences` | auth | Präferenzmatrix (Typ × Kanal; Security-/System-Typen readonly, N-2) |
| GET/POST | `/watches` | auth | Beobachtungen (space/article) |
| DELETE | `/watches/:id` | auth | Beobachtung beenden |

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET/PUT | `/admin/notifications/smtp` | `configuration.settings.manage` | SMTP-Konfiguration (Passwort write-only) |
| POST | `/admin/notifications/smtp/test` | `configuration.settings.manage` | Testversand mit konkreter Fehlermeldung (US-11-01) |
| GET | `/admin/notifications/email-log` | `configuration.settings.manage` | Zustelldiagnose (Empfänger gehasht, 30 Tage) |
| GET/POST/PATCH/DELETE | `/admin/webhooks[/:id]` | `configuration.settings.manage` | Webhook-Endpunkte (Phase 3; URL-Validierung N-7) |
| POST | `/admin/webhooks/:id/test` | `configuration.settings.manage` | Test-Zustellung (Phase 3) |
