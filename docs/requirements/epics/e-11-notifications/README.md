# E-11 · Notifications

**Status:** Verbindlich · **Phase:** 1–3 · **Priorität:** Must ·
**Module:** [notification](../../../services/notification-service.md) ·
**FRs:** FR-NOTI-001…008 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Relevante Ereignisse erreichen die richtigen Personen über den richtigen Kanal — transaktionale
E-Mails (vollständig konfigurierbares SMTP), In-App-Benachrichtigungen und vorbereitete
Webhooks — steuerbar über nutzerindividuelle Präferenzen, gebrandet und lokalisiert.

## Scope

**Enthalten:**

- SMTP-Versand: Host/Port/TLS/Auth konfigurierbar, Testversand, Queue mit Retry
- Transaktionale Mails: Verifizierung, Passwort-Reset, Einladungen, Security-Hinweise
- In-App-Notifications: Liste, Ungelesen-Zähler, Als-gelesen, Aufräum-Regeln
- Ereigniskatalog: neue Beiträge (Watch), Review benötigt/abgeschlossen, Übersetzung outdated,
  Kommentare/Antworten, Achievements, Security-Ereignisse, System-Warnungen
- Präferenzmatrix (Ereignistyp × Kanal) pro Nutzer; Security-Mails nicht abbestellbar
- Templates: MJML→HTML + Text-Fassung, Instanz-Branding, i18n nach Empfängersprache
- Webhooks (Phase 3): signierte Zustellung, Ereignis-Abonnements, Retry — Architektur vorbereitet

**Nicht enthalten:** Push-Notifications (Browser/Mobile, nach 1.0), Digest-Mails (Could,
Phase 3), Chat-Integrationen (Discord/Slack — über Webhooks realisierbar, kein Kernfeature).

## Abhängigkeiten

Benötigt: SMTP-Server des Betreibers, BullMQ, `identity` (Empfänger/Locale). Konsumiert Events
fast aller Module. Watch-Mechanik (Spaces/Artikel beobachten) gehört fachlich zu Notification.

## Erfolgsmetriken

- E-Mail-Zustellversuch < 60 s nach Ereignis (Queue-SLA im Normalbetrieb)
- SMTP-Ausfall: 0 verlorene Mails (Retry + Persistenz), Health-Warnung sichtbar
- Präferenzen greifen ohne Verzögerung (Test: Deaktivierung → keine weitere Mail)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Benachrichtigungsflut nervt Nutzer | feingranulare Präferenzen, Thread-Deduplizierung (max. 1 Mail pro Thread/Stunde), Digest-Option später |
| Mail-Spoofing/Phishing-Verwechselbarkeit | konsistente Templates, keine Roh-Links ohne Kontext, SPF/DKIM-Hinweise im Runbook |
| Webhook-Missbrauch (SSRF) | URL-Validierung (kein internes Netz), Signatur, nur Admin-konfigurierbar (security/05) |
