# Security Policy

## Sicherheitslücke melden

Bitte melde Sicherheitslücken **nicht** als öffentliches Issue.

- Bevorzugt: **GitHub Security Advisory** („Report a vulnerability" im Security-Tab dieses
  Repositories).
- Alternativ per E-Mail an die im Repository-Profil hinterlegte Security-Adresse.

Wir bestätigen den Eingang innerhalb von **48 Stunden** und liefern eine Erstbewertung
innerhalb von **5 Werktagen**. Koordinierte Veröffentlichung: Der Fix erscheint vor den
Details; Security-Releases sind in den Release Notes als „Sicherheitsrelevant — Update
empfohlen" markiert.

Details zum Prozess (Schweregrade, Reaktionszeiten, Advisories):
[docs/security/08-incident-response-recovery.md](docs/security/08-incident-response-recovery.md).

## Unterstützte Versionen

Bis zum Release 1.0 wird ausschließlich der aktuelle `main`-Stand unterstützt. Ab 1.0 erhalten
die jeweils letzte Minor-Version Sicherheitsupdates.

## Betreiber-Härtung

Checkliste für sichere Installationen:
[docs/security/checklists/deployment-hardening.md](docs/security/checklists/deployment-hardening.md).
