# E-01 · User Stories

**Epic:** [README.md](README.md) · Personas → [../../02-stakeholders-personas.md](../../02-stakeholders-personas.md)

## US-01-01 · Geführte Ersteinrichtung (P7 Sam) — FR-CONF-001, FR-CONF-002 · Must

> Als Plattform-Administrator möchte ich beim Erststart durch einen Setup Wizard geführt werden,
> damit ich die Instanz ohne manuelle Konfigurationsdateien korrekt und sicher einrichte.

**Akzeptanzkriterien**

1. **Gegeben** eine frische Installation ohne abgeschlossenes Setup, **wenn** ich eine beliebige
   URL öffne, **dann** werde ich auf `/setup` umgeleitet; alle anderen Routen und die API
   (außer `/api/v1/setup/*`, Health) sind gesperrt.
2. **Gegeben** der Schritt „System", **wenn** Checks laufen, **dann** sehe ich je Prüfung
   (Ressourcen, PostgreSQL, Redis, Meilisearch, Storage) Status, Messwert und bei Fehlern die
   konkrete Ursache.
3. **Gegeben** der Schritt „Datenbank", **wenn** die Verbindung steht, **dann** kann ich
   Migrationen ausführen und sehe deren Ergebnis; bei Fehlschlag bleibt der Schritt wiederholbar,
   ohne den Wizard neu zu beginnen.
4. **Gegeben** der Schritt „Storage", **wenn** ich einen Provider konfiguriere, **dann** führt
   der Wizard einen echten Schreib-/Lese-/Löschtest aus und zeigt das Ergebnis.
5. **Gegeben** alle Pflicht-Checks grün, **wenn** ich das Admin-Konto erstelle (E-Mail, Handle,
   Passwort gemäß Policy), **dann** erhalte ich einmalig Recovery Codes und muss deren Sicherung
   aktiv bestätigen, bevor das Setup abschließt.

## US-01-02 · OAuth im Setup testen (P7 Sam) — FR-CONF-001 · Should

> Als Plattform-Administrator möchte ich OAuth-Provider bereits im Wizard anlegen und testen,
> damit Social Login ab der ersten Minute funktioniert.

1. **Gegeben** Discord-Client-Daten im Wizard, **wenn** ich „Verbindung testen" wähle, **dann**
   validiert die Plattform Credentials und Redirect-URI und zeigt die exakt einzutragende
   Callback-URL an.
2. **Gegeben** ich überspringe den OAuth-Schritt, **dann** ist er später in der Admin-UI ohne
   Einschränkung nachholbar (FR-IDNT-010).

## US-01-03 · Module schalten (P7 Sam / P5 Deniz) — FR-CONF-004 · Must

> Als Administrator möchte ich Module (Organisationen, Übersetzungen, Repository-Integration,
> Kommentare, Achievements) einzeln aktivieren, damit die Instanz nur zeigt, was mein
> Einsatzszenario braucht.

1. **Gegeben** Modul „Übersetzungen" deaktiviert, **wenn** ein Nutzer eine Übersetzungs-URL oder
   -API aufruft, **dann** antwortet die Plattform 404 / `module_disabled`; die UI blendet alle
   Einstiegspunkte aus.
2. **Gegeben** ein Modul wird nachträglich aktiviert, **dann** sind bestehende Daten des Moduls
   (aus früherer Aktivierung) unverändert wieder verfügbar.
3. **Gegeben** ein Kernmodul (identity, knowledge, …), **dann** bietet die UI keine
   Deaktivierung an (→ [architecture/02 §7](../../../architecture/02-module-boundaries.md)).

## US-01-04 · Instanz-Branding (P7 Sam) — FR-CONF-003 · Must

1. **Gegeben** die Instanzeinstellungen, **wenn** ich Name, Logo (SVG/PNG via Admin-Upload,
   FR-MEDI-006) und Standardsprache setze, **dann** erscheinen sie in UI, E-Mail-Templates und
   Meta-Tags ohne Neustart.
2. **Gegeben** kein eigenes Branding, **dann** nutzt die Instanz neutrale Defaults der Plattform
   (Trademark Policy beachtet).

## US-01-05 · Setup-Sperre nach Abschluss (P7 Sam) — FR-CONF-001 · Must

1. **Gegeben** abgeschlossenes Setup, **wenn** jemand `/setup` oder `/api/v1/setup/*` aufruft,
   **dann** wird der Zugriff verweigert (403) und als Audit-Event `setup.access_denied`
   protokolliert.
2. **Gegeben** ein Re-Setup ist wirklich nötig, **dann** existiert dafür ausschließlich der
   auditierte CLI-Weg (→ [E-13](../e-13-operations-recovery/README.md)), nie eine Web-Route.

## US-01-06 · Konfigurations-Herkunft verstehen (P7 Sam) — FR-CONF-006 · Must

1. **Gegeben** `SMTP_HOST` ist per ENV gesetzt, **wenn** ich die SMTP-Einstellungen in der
   Admin-UI öffne, **dann** ist das Feld schreibgeschützt und als „durch Umgebungsvariable
   gesetzt" gekennzeichnet.
2. **Gegeben** ein per DB gesetzter Wert, **wenn** ich ihn ändere, **dann** greift er ohne
   Neustart (Config-Cache-Invalidierung, → [architecture/04 §8](../../../architecture/04-backend-architecture.md)).
