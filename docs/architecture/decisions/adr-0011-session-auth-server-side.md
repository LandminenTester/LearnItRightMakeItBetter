# ADR-0011: Serverseitige Sessions statt JWT als primäre Web-Authentifizierung

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Sicherheitsanforderungen verlangen sofortige Widerrufbarkeit (Kontosperrung FR-IDNT-019,
Session-Revoke FR-IDNT-015, MFA-Zustand pro Sitzung), sichere Cookie-Attribute (NFR-020) und
Nachvollziehbarkeit (Audit). Redis steht als Infrastruktur bereit (ADR-0006).

## Entscheidung

Web-Authentifizierung über **serverseitige Sessions**: Ein zufälliges, hochentropisches
Session-Token wird als HTTP-only-Cookie (`Secure`, `SameSite=Lax`, `__Host-`-Präfix) gesetzt;
der Server hält Sitzungszustand (User, MFA-Status, Ablauf, Gerät/IP) in Redis mit
DB-Spiegelung für die Sitzungsliste. **Kein JWT im Browser.**
Für nicht-interaktive API-Nutzung gibt es **Personal Access Tokens** (FR-IDNT-016), gespeichert
als Hash, mit Scopes und Ablauf (→ [api/02](../../api/02-authentication-and-tokens.md)).

## Betrachtete Alternativen

- **JWT (stateless) als Session-Ersatz** — abgelehnt: Widerruf erfordert Blocklist (= doch
  serverseitiger Zustand), Token-Inhalte veralten (Rollenentzug greift erst nach Ablauf),
  XSS-Diebstahlrisiko bei Storage außerhalb HTTP-only-Cookies. Vorteile (Statelessness) sind im
  Monolithen mit Redis irrelevant.
- **JWT nur als internes Format im Cookie** — abgelehnt: bringt Komplexität ohne Nutzen
  gegenüber opaken Tokens.

## Konsequenzen

- ✅ Sperrung/Abmeldung wirkt sofort; Sitzungsliste und „alle Geräte abmelden" trivial;
  MFA-Step-up pro Sitzung abbildbar.
- ✅ Kein Token-Parsing im Frontend — der Client kennt nur `GET /auth/session`.
- ⚠️ Redis-Ausfall unterbricht Anmeldungen (harte Abhängigkeit, NFR-014) — akzeptiert,
  dokumentiert im Betriebs-Runbook.
- ⚠️ Skalierung über Instanzgrenzen (späteres Multi-Backend) braucht gemeinsamen Redis —
  bereits Teil der K8s-Referenztopologie.
