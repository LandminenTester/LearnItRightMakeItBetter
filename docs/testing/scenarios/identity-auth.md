# E2E-Szenarien · Identity & Auth

**Epics:** E-02, E-12 · OAuth via Fake-Provider im Stack ([../04 §3](../04-e2e-testing.md))

## IA-01 `@core` · Lokale Registrierung — US-02-01

Registrieren (Policy-Verstoß zeigt Feldfehler; danach gültig) → Verifizierungsmail via
Mailhog → Link einlösen → Konto verifiziert → Beitrag möglich. Negativ: doppelte E-Mail ⇒
identische Erfolgsantwort, keine zweite Mailzustellung an Fremd-Postfach-Assertion.

## IA-02 `@core` · Login/Logout/Session — US-02-07

Login (Fehlversuch generisch, Erfolg setzt Cookie) → Sitzungsliste zeigt Gerät → zweite
Browser-Session → aus Session 1 widerrufen ⇒ Session 2 bei nächstem Request ausgeloggt →
„alle anderen abmelden" wirkt.

## IA-03 `@core` · OAuth-Login + Linking — US-02-02, US-02-03

Fake-Discord-Login (Erstanmeldung: Handle-Wahl) → Logout → Fake-GitHub verknüpfen (mit
Re-Auth) → Login über beide Wege am selben Konto → Unlink der letzten Methode wird verweigert
(I-11). Negativ: manipulierter `state` ⇒ Fehlerseite ohne Session + Audit-Event.

## IA-04 · Passwort-Reset — FR-IDNT-004

Reset anfordern (enumeration-gleiche Antwort für unbekannte Adresse) → Mail-Link → neues
Passwort → alte Sessions invalidiert (zweite Session ausgeloggt), Security-Mail versendet.

## IA-05 · MFA-Lebenszyklus — US-02-05

TOTP einrichten (Secret aus Setup-Antwort, Code generiert im Test) → Recovery Codes einmalig
sichtbar → Logout/Login verlangt Code → falscher Code 5× ⇒ Challenge verfällt →
Recovery-Code-Login (Code entwertet, Security-Mail, Audit `warning`) → MFA deaktivieren mit
Re-Auth.

## IA-06 · MFA-Policy-Zwang — US-02-06

Admin aktiviert Policy „MFA für platform.admin" → zweiter Admin ohne MFA meldet sich an ⇒
nur MFA-Setup erreichbar (alle anderen Routen redirecten, API 403 `mfa_required`) → nach
Einrichtung voller Zugriff.

## IA-07 · Registrierungsmodi & Einladung — US-02-08

Modus `invite_only`: freie Registrierung verweigert; Einladung (Admin) → Mail → Konto über
Token; Fake-OAuth-Neuanmeldung ohne Einladung abgebrochen. Modus `closed`: nur
JIT-Provisionierung über OIDC-Fake mit aktiviertem Flag.

## IA-08 · Admin-Sperrung — US-02-07.3

Admin sperrt Konto (Begründung) ⇒ dessen aktive Session sofort tot, PAT-Aufruf 401
`account_inactive`, Audit `warning` mit Actor; Entsperrung stellt Login wieder her.

## IA-09 · DSGVO Export + Löschung — US-12-04, US-12-05

Export anfordern (Re-Auth) → Archiv-Download enthält Konto/Profil/Inhalte-Markdown →
Konto löschen (Re-Auth + Bestätigung) → Login unmöglich, Profil-URL 404, publizierter
Artikel zeigt „Gelöschtes Mitglied", Suche findet Profil nicht mehr; Audit-Events
pseudonymisiert vorhanden (API-Prüfung als Admin).

## IA-10 · Rate Limits — NFR-025

11 Login-Fehlversuche ⇒ 429 mit `Retry-After` (Konto-Fenster greift, Security-Mail);
Registrierung 6×/IP ⇒ 429. (Limits im e2e-Stack auf Testwerte konfiguriert.)
