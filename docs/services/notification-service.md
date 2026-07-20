# Notification Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-NOTI-001…008 · **Epic:** [E-11](../requirements/epics/e-11-notifications/README.md) ·
**Schema:** [database/schemas/notification.md](../database/schemas/notification.md)

## 1. Zweck & Verantwortlichkeiten

Eigenständiger Zustell-Service (Fachkonzept §13):

- **Kanäle:** SMTP-E-Mail, In-App; **Webhooks** vorbereitet (Phase 3)
- Ereignis-Dispatch: Domain Events → Empfängerermittlung → Präferenzfilter → Kanal-Zustellung
- Watch-Mechanik (Spaces/Artikel beobachten)
- Template-System (MJML→HTML + Text), Instanz-Branding, i18n nach Empfängersprache
- Nutzer-Präferenzen (Ereignistyp × Kanal)

## 2. Abgrenzung

Notification ruft **keine Fachmodule** auf (Regel M-4, Ausnahme `IdentityPort` für
Empfängerdaten). Auslösende Fakten kommen vollständig aus Event-Payloads bzw. dem
`notification.dispatch`-Port.

## 3. Domänenmodell

- `Notification` — `userId`, `type`, `payload` (JSON: IDs, Titel, Links), `readAt?`,
  `createdAt`; TTL-Bereinigung nach 90 Tagen.
- `NotificationPreference` — (`userId`, `type`, `channel`) → `enabled`; fehlender Eintrag =
  Katalog-Default.
- `Watch` — (`userId`, `resourceType` (`space`|`article`), `resourceId`).
- `EmailLog` — Zustellprotokoll (Empfänger gehasht, Typ, Status, Fehler) für Diagnose, 30 Tage.
- `WebhookEndpoint` (Phase 3) — `url`, `secretHash`, `events[]`, `enabled`, `failureCount`.

## 4. Ereigniskatalog (FR-NOTI-004)

| Typ | Auslöser | Default In-App | Default E-Mail | Abbestellbar |
|---|---|---|---|---|
| `review.requested` | Artikel/Übersetzung eingereicht (an Reviewer) | ✔ | ✔ | ✔ |
| `review.completed` | Review-Ergebnis (an Autor/Translator) | ✔ | ✔ | ✔ |
| `content.published_in_watched` | Publikation in beobachtetem Space | ✔ | ✖ | ✔ |
| `content.updated_watched` | Neue Version beobachteten Artikels | ✔ | ✖ | ✔ |
| `comment.reply` / `comment.on_own` | Antwort/Kommentar | ✔ | ✖ | ✔ |
| `translation.outdated` | Original weitergezogen (an Translator + Language Maintainer) | ✔ | ✔ | ✔ |
| `org.invite` / `org.membership_changed` | Org-Ereignisse | ✔ | ✔ | teilweise |
| `achievement.awarded` | Achievement verliehen | ✔ | ✖ | ✔ |
| `repo.sync_broken` | Repo-Verknüpfung defekt (an Owner) | ✔ | ✔ | ✔ |
| `security.*` | Login neues Gerät, MFA-Änderung, Recovery-Nutzung, Passwort-Reset | ✔ | ✔ | **✖** |
| `system.warning` | Konsistenz-/Betriebswarnungen (an Admins) | ✔ | ✔ | ✖ |
| Transaktional | Verifizierung, Reset, Einladung | — | ✔ | ✖ |

## 5. Fachliche Regeln

- **N-1:** Zustellkette: Event-Handler → `dispatch`-Job (Queue `mail` bzw. In-App synchron in
  Transaktion) → Empfänger auflösen → Präferenz prüfen → zustellen. Jeder Schritt idempotent
  (`dedupeKey` = Event-ID + Empfänger + Kanal).
- **N-2:** Security-/System-Typen ignorieren Abbestellungen (Katalog-Spalte).
- **N-3:** Deduplizierung: gleiche (`type`, `resource`, Empfänger) innerhalb 1 h werden zu einer
  Benachrichtigung zusammengefasst (Zähler statt Flut, US-11-03.3).
- **N-4:** E-Mails: Absender/Branding aus Instanzkonfiguration; jede Mail als HTML + Plaintext;
  Sprache = Empfänger-Locale, Fallback Instanz-Default; List-Unsubscribe-Header für
  abbestellbare Typen (Link auf Präferenzen).
- **N-5:** SMTP-Fehler: Retry 5× exponentiell (1 min → 4 h); danach Dead-Letter + `EmailLog`
  Fehlerstatus; Health meldet degradiert bei anhaltender Fehlerrate.
- **N-6:** In-App: `unreadCount` denormalisiert in Redis (Invalidierung bei Lesen); Polling in
  1.0 (30-s-Intervall), SSE/WebSocket-Upgrade vorbereitet
  ([api/04](../api/04-realtime-and-events.md)).
- **N-7:** Webhooks (Phase 3): nur Admin-konfiguriert; URL-Validierung gegen private
  Netzbereiche (SSRF); HMAC-SHA256-Signatur; Auto-Disable nach 10 Fehlversuchen (US-11-06).

## 6. Schnittstellen

**API (Auszug):** `GET /notifications` (+ `unread-count`, `mark-read`),
`GET/PUT /users/me/notification-preferences`, `POST /watches` / `DELETE /watches/:id`,
Admin: `/admin/notifications/smtp` (+ Testversand), `/admin/webhooks` (Phase 3).

**Konsumierte Events:** siehe Katalog — technisch abonniert der Dispatcher die in
[architecture/02 §5](../architecture/02-module-boundaries.md) gelisteten Events.

**Ports:** `NotificationPort.dispatch(type, recipients|resolver, payload)` für synchrone
Auslöser (z. B. Setup-Testmail); `IdentityPort.getNotificationTarget` (genutzt).

## 7. Hintergrundjobs

| Job | Queue | Zweck |
|---|---|---|
| `send-mail` | mail | Rendern + SMTP-Versand (N-4/N-5) |
| `dispatch-event` | mail | Empfängerauflösung großer Fan-outs (Watcher) |
| `notification-gc` | maintenance | 90-Tage-Bereinigung, EmailLog-Rotation |
| `deliver-webhook` | mail | Phase 3 |

## 8. Konfiguration

SMTP (Host, Port, TLS-Modus, User, Passwort verschlüsselt, Absender), In-App-Polling-Intervall,
Digest (Phase 3) — Instanzeinstellungen; Katalog-Defaults im Code.

## 9. Sicherheit

Keine sensiblen Inhalte in Mails (nur Verweise + Kurzkontext); Tokens (Reset/Verify) sind
Einweg-Links mit Ablauf; `EmailLog` speichert Empfänger nur gehasht (Datenschutz); Webhook-SSRF
siehe N-7.

## 10. Offene Punkte

- Digest-Rendering (tages-/wochenweise Sammelmails) — Phase 3 (Could).
- Browser-Push — nach 1.0.
