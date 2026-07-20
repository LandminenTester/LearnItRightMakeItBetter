# E-11 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [notification-service.md](../../../services/notification-service.md)

## US-11-01 · SMTP der Instanz (P7 Sam) — FR-NOTI-001 · Must · Phase 1

1. **Gegeben** die SMTP-Konfiguration (Host, Port, TLS-Modus, Auth, Absendername/-adresse) in
   der Admin-UI, **wenn** ich „Testmail senden" wähle, **dann** erhalte ich Erfolg oder die
   konkrete SMTP-Fehlermeldung.
2. **Gegeben** das gespeicherte SMTP-Passwort, **dann** wird es verschlüsselt abgelegt und nie
   wieder im Klartext angezeigt (NFR-022).
3. **Gegeben** ein SMTP-Ausfall, **dann** verbleiben Mails in der Queue (Retry mit Backoff) und
   `/readyz` meldet die degradierte Abhängigkeit.

## US-11-02 · Transaktionale Mails (alle) — FR-NOTI-002 · Must · Phase 1

1. **Gegeben** Registrierung/Passwort-Reset/Einladung, **dann** kommt die jeweilige Mail in der
   Sprache des Empfängers, mit Instanz-Branding, als HTML + Text-Alternative.
2. **Gegeben** ein Security-Ereignis (neues Gerät, MFA-Änderung, Recovery-Code-Nutzung), **dann**
   wird die Mail unabhängig von Präferenzen versendet (nicht abbestellbar).

## US-11-03 · In-App auf dem Laufenden (P2 Mira) — FR-NOTI-003, 004 · Must · Phase 2

1. **Gegeben** ein Artikel wird in meinem Space eingereicht, **dann** erscheint binnen Sekunden
   eine In-App-Benachrichtigung (Glocke mit Ungelesen-Zähler); Klick führt direkt zur
   Review-Ansicht.
2. **Gegeben** meine Benachrichtigungsliste, **wenn** ich „alle als gelesen markieren" wähle,
   **dann** setzt sich der Zähler auf 0; Einträge bleiben 90 Tage einsehbar.
3. **Gegeben** mehrere Antworten im selben Kommentar-Thread, **dann** werden sie zu einer
   Benachrichtigung zusammengefasst (Deduplizierung).

## US-11-04 · Präferenzen (P2 Mira) — FR-NOTI-005 · Should · Phase 2

1. **Gegeben** meine Präferenzmatrix (Ereignistyp × Kanal E-Mail/In-App), **wenn** ich
   „Review benötigt: nur In-App" setze, **dann** erhalte ich dafür keine E-Mails mehr — sofort.
2. **Gegeben** ein Ereignistyp ohne explizite Einstellung, **dann** greift der dokumentierte
   Default (In-App an, E-Mail nur für direkte Beteiligung).

## US-11-05 · Beobachten (P1 Alex) — FR-NOTI-004 · Should · Phase 2

1. **Gegeben** „Beobachten" auf einem Space, **wenn** dort ein Artikel publiziert wird, **dann**
   werde ich gemäß Präferenz benachrichtigt; „Nicht mehr beobachten" stoppt dies.
2. **Gegeben** „Beobachten" auf einem Artikel, **dann** informieren mich neue Versionen und
   Kommentare.

## US-11-06 · Webhooks vorbereitet (P6 Claire / P7 Sam) — FR-NOTI-007 · Could · Phase 3

1. **Gegeben** ein Admin-Webhook (URL, Secret, Ereignisliste), **wenn** ein abonniertes Ereignis
   eintritt, **dann** wird ein signierter POST (`X-Signature: HMAC-SHA256`) mit
   Retry-bei-Fehler zugestellt.
2. **Gegeben** eine URL in privaten Netzbereichen (RFC 1918, localhost), **dann** lehnt die
   Validierung sie ab (SSRF-Schutz).
3. **Gegeben** 10 aufeinanderfolgende Zustellfehler, **dann** wird der Webhook deaktiviert und
   der Admin benachrichtigt.
