# E-02 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [identity-service.md](../../../services/identity-service.md)

## US-02-01 · Registrierung mit E-Mail (P1 Alex) — FR-IDNT-001, 002 · Must · Phase 1

> Als neuer Nutzer möchte ich mich mit E-Mail und Passwort registrieren, damit ich ohne
> Drittanbieter-Konto teilnehmen kann.

1. **Gegeben** offene Registrierung, **wenn** ich ein Passwort unter 12 Zeichen oder aus der
   Kompromittierungsliste wähle, **dann** wird die Registrierung mit verständlicher Begründung
   abgelehnt (Regel I-6).
2. **Gegeben** erfolgreiche Registrierung, **wenn** ich den Verifizierungslink binnen 24 h öffne,
   **dann** ist mein Konto verifiziert; abgelaufene Links bieten erneuten Versand an.
3. **Gegeben** eine bereits registrierte E-Mail, **wenn** ich mich erneut registriere, **dann**
   verrät weder Antwort noch Antwortzeit, ob die Adresse existiert (Regel I-8).
4. **Gegeben** ein unverifiziertes Konto, **wenn** ich beitragen will (Artikel, Kommentar),
   **dann** werde ich zur Verifizierung aufgefordert (Regel I-7).

## US-02-02 · Social Login (P1 Alex) — FR-IDNT-005, 006, 007 · Must · Phase 1

1. **Gegeben** Discord aktiviert, **wenn** ich den OAuth-Flow abschließe, **dann** existiert ein
   Konto mit verknüpfter Discord-Identität und ich bin angemeldet; bei Erstanmeldung wähle ich
   meinen Handle.
2. **Gegeben** Registrierungsmodus `invite_only`, **wenn** ein Unbekannter per GitHub anmeldet,
   **dann** wird der Flow abgebrochen mit Hinweis auf Einladungspflicht — es entsteht kein Konto.
3. **Gegeben** ein abgebrochener/manipulierter Flow (state-Mismatch), **dann** endet er in einer
   Fehlermeldung ohne Session; das Ereignis wird auditiert.

## US-02-03 · Konten verknüpfen (P1 Alex) — FR-IDNT-009 · Must · Phase 2

> Als Nutzer mit Discord-Konto möchte ich zusätzlich GitHub verknüpfen, damit ich mich über
> beide Wege anmelden kann.

1. **Gegeben** ich bin angemeldet, **wenn** ich unter „Verknüpfte Konten" GitHub hinzufüge und
   den Flow abschließe, **dann** listet mein Konto beide Identitäten mit Provider-Namen und
   Verknüpfungsdatum.
2. **Gegeben** meine letzte verbleibende Anmeldemethode, **wenn** ich sie trennen will, **dann**
   verhindert das System dies mit Erklärung (Regel I-11).
3. **Gegeben** Trennen einer Methode, **dann** ist frische Re-Auth (≤ 5 min) erforderlich.

## US-02-04 · Enterprise SSO (P6 Claire) — FR-IDNT-008, 010 · Must · Phase 3

1. **Gegeben** Issuer-URL, Client-ID und Secret eines OIDC-Providers, **wenn** ich den
   Verbindungstest starte, **dann** validiert die Plattform das Discovery-Dokument und zeigt
   die einzutragende Redirect-URI.
2. **Gegeben** `jitProvisioning` aktiv und Modus `closed`, **wenn** sich ein unbekannter
   Mitarbeiter per SSO anmeldet, **dann** wird sein Konto automatisch angelegt (verifizierte
   E-Mail übernommen, sofern `trustEmailVerified`).
3. **Gegeben** ein deaktivierter Provider, **dann** verschwindet er vom Login-Screen und
   bestehende Sessions seiner Nutzer bleiben bis Ablauf gültig (kein Massen-Logout ohne
   Admin-Entscheidung).

## US-02-05 · MFA einrichten (alle) — FR-IDNT-011, 012 · Must · Phase 2

1. **Gegeben** MFA-Einrichtung, **wenn** ich den QR-Code scanne und einen gültigen TOTP-Code
   eingebe, **dann** ist MFA aktiv und ich erhalte einmalig 10 Recovery Codes zum Sichern.
2. **Gegeben** aktives MFA, **wenn** ich mich anmelde, **dann** folgt nach dem ersten Faktor die
   TOTP-Abfrage; erst danach ist die Session `mfaVerified`.
3. **Gegeben** verlorenes TOTP-Gerät, **wenn** ich einen unverbrauchten Recovery Code eingebe,
   **dann** erhalte ich Zugang, der Code ist entwertet, ein Security-Hinweis wird versendet
   (Regel I-17).
4. **Gegeben** MFA-Deaktivierung, **dann** erfordert sie frische Re-Auth und erzeugt
   Audit + Security-Mail.

## US-02-06 · MFA erzwingen (P6 Claire) — FR-IDNT-013 · Must · Phase 3

1. **Gegeben** Policy „MFA verpflichtend für Rolle `platform.admin`", **wenn** sich ein Admin
   ohne MFA anmeldet, **dann** sind bis zur Einrichtung ausschließlich MFA-Setup-Endpunkte
   nutzbar (Regel I-18).
2. **Gegeben** instanzweite MFA-Pflicht, **dann** greift der Enrollment-Zwang für alle bei der
   nächsten Anmeldung; aktive Sessions ohne MFA verlieren Schreibrechte.

## US-02-07 · Sitzungen im Griff (alle / P7 Sam) — FR-IDNT-015, 019 · Should · Phase 2

1. **Gegeben** meine Sitzungsliste (Gerät, IP-Region, letzte Aktivität, aktuelle Sitzung
   markiert), **wenn** ich eine fremde Sitzung widerrufe, **dann** ist deren Cookie sofort
   ungültig.
2. **Gegeben** „Alle anderen Sitzungen abmelden", **dann** bleibt nur die aktuelle bestehen.
3. **Gegeben** ein Admin sperrt ein Konto, **dann** sind alle Sessions und PATs sofort
   unbrauchbar; der Vorgang ist auditiert mit Begründung (Regel I-4).

## US-02-08 · Einladungen (P5 Deniz / P7 Sam) — FR-IDNT-017, 021 · Must · Phase 1

1. **Gegeben** Modus `invite_only`, **wenn** ich als Admin eine Einladung an eine E-Mail sende,
   **dann** kann genau diese Adresse binnen Gültigkeit (Default 14 Tage) ein Konto erstellen.
2. **Gegeben** eine Einladung mit vordefinierter Rolle, **wenn** sie angenommen wird, **dann**
   ist die Rollenzuweisung sofort aktiv.

## US-02-09 · Personal Access Tokens (P4 Sofia) — FR-IDNT-016 · Should · Phase 3

1. **Gegeben** PAT-Erstellung mit Scopes und Ablauf ≤ 1 Jahr, **wenn** das Token erzeugt wird,
   **dann** sehe ich es genau einmal; danach nur Präfix + letzte Nutzung.
2. **Gegeben** ein API-Aufruf mit PAT, **dann** wirken nur die Token-Scopes — höchstens meine
   eigenen effektiven Rechte (Regel I-20).
3. **Gegeben** Widerruf, **dann** ist das Token sofort ungültig.

## US-02-10 · Konto löschen (alle) — FR-IDNT-018 · Must · Phase 2

1. **Gegeben** Löschantrag mit frischer Re-Auth, **wenn** ich bestätige, **dann** startet die
   Löschung: PII entfernt, Sessions/PATs widerrufen, Beiträge anonymisiert
   (→ [database/06](../../../database/06-data-lifecycle-gdpr.md)).
2. **Gegeben** die Löschung, **dann** erhalte ich zuvor optional einen Datenexport
   (JSON, DSGVO-Auskunft).
