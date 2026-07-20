# E-13 · User Stories

**Epic:** [README.md](README.md) · Runbooks: [deployment/runbooks/](../../../deployment/runbooks/README.md)

## US-13-01 · Ausgesperrt, aber nicht verloren (P7 Sam) — FR-PLAT-006 · Must · Phase 2

> Als Betreiber möchte ich bei Verlust aller Admin-Zugänge (Passwörter + MFA-Geräte) den
> Zugriff kontrolliert wiederherstellen, ohne die Sicherheit der Instanz zu schwächen.

1. **Gegeben** Systemzugriff auf den Container, **wenn** ich
   `platform recovery create-emergency-admin --reason "..."` ausführe, **dann** entsteht ein
   zeitlich begrenztes (24 h) Emergency-Konto mit einmalig angezeigten Zugangsdaten.
2. **Gegeben** die Anmeldung mit dem Emergency-Konto, **dann** sehe ich einen dauerhaften
   Warnbanner und alle Aktionen werden mit erhöhter Audit-Stufe protokolliert.
3. **Gegeben** die Erstellung, **dann** werden alle bestehenden Admins per E-Mail informiert;
   das Ereignis ist unlöschbar auditiert.
4. **Gegeben** Ablauf oder manuelle Deaktivierung, **dann** ist das Konto endgültig unbrauchbar.

## US-13-02 · Admin-Recovery ohne CLI (P7 Sam) — FR-PLAT-006 · Must · Phase 2

1. **Gegeben** verlorenes Admin-MFA-Gerät, **wenn** ich einen Setup-Recovery-Code nutze,
   **dann** erhalte ich Zugang und werde zur MFA-Neueinrichtung gezwungen (Regel I-17).
2. **Gegeben** vergessenes Admin-Passwort bei funktionierender E-Mail, **dann** genügt der
   normale Reset-Flow — Recovery-Sonderwege sind dafür nicht nötig.

## US-13-03 · CLI-Werkzeuge (P7 Sam) — FR-PLAT-006 · Must · Phase 2

1. **Gegeben** `platform recovery reset-password --user <handle>`, **dann** wird ein
   Einmal-Reset-Link auf stdout ausgegeben (kein Klartext-Passwort) und der Vorgang auditiert.
2. **Gegeben** `platform recovery disable-mfa --user <handle> --reason "..."`, **dann** wird MFA
   entfernt, der Nutzer benachrichtigt und der Vorgang auditiert.
3. **Gegeben** eine Fehlkonfiguration blockiert den Start (z. B. kaputter OIDC-Provider),
   **wenn** ich `platform recovery disable-provider <id>` ausführe, **dann** startet die
   Instanz wieder mit lokalem Login.

## US-13-04 · Betriebstransparenz (P7 Sam) — FR-PLAT-005 · Must · Phase 1

1. **Gegeben** `/healthz`, **dann** antwortet es 200, solange der Prozess lebt — ohne
   Abhängigkeitsprüfung (für Container-Restarts).
2. **Gegeben** `/readyz` bei Meilisearch-Ausfall, **dann** meldet es die degradierte
   Abhängigkeit (Detail-JSON), Artikel bleiben abrufbar, die Suche zeigt einen Wartungshinweis
   (NFR-014).
3. **Gegeben** `/metrics`, **dann** liefert es Prometheus-Format mit HTTP-Latenzen,
   Queue-Tiefen, Job-Dauern, DB-Pool- und Cache-Kennzahlen (NFR-054).
4. **Gegeben** ein Request-Fehler im Log, **dann** finde ich über die `requestId` alle
   zugehörigen Logzeilen (NFR-053).

## US-13-05 · Wartung sichtbar (P7 Sam) — Must · Phase 2

1. **Gegeben** die Admin-Systemseite, **dann** sehe ich: Versionsstand, Migrationsstatus,
   Queue-Übersicht (Tiefe, Fehlerrate, Dead-Letter), letzte Wartungsjob-Läufe und
   Storage-/Index-Status.
2. **Gegeben** ein Dead-Letter-Job, **wenn** ich ihn inspiziere, **dann** sehe ich Payload
   (ohne Secrets), Fehlerhistorie und kann ihn erneut einreihen oder verwerfen (auditiert).
