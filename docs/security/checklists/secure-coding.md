# Checkliste · Secure Coding

**Status:** Verbindlich · Referenz beim Entwickeln — gruppiert nach Feature-Typ.

## Immer (jeder Endpunkt)

- [ ] `@RequirePermission(…)` oder begründetes `@Public()` deklariert
- [ ] Zod-Schema `strict()` für Body/Query/Params; Limits (Länge, Anzahl, Bereich) gesetzt
- [ ] Objektzugriff prüft Kontext-Zugehörigkeit (`can()` mit Ressource — IDOR, E-1)
- [ ] 404-Semantik bei vertraulicher Existenz (K-1/O-5)
- [ ] Fehler als typisierte Domain-Exceptions; keine Interna in Antworten
- [ ] Rate-Limit-Kategorie zugeordnet ([api/01 §6](../../api/01-api-conventions.md))
- [ ] Audit-Event, falls im [Katalog](../07-audit-logging.md) gefordert

## Nutzergenerierter Inhalt (Markdown, Namen, Links)

- [ ] Rendering nur über die zentrale Pipeline (nie eigener Sanitizer/`v-html`)
- [ ] URLs: Schema-Allowlist; extern mit `rel="nofollow noopener noreferrer"`
- [ ] Keine serverseitigen Fetches von Nutzer-URLs (SSRF §4 in [05](../05-application-security.md))

## Auth-/Konto-nahe Features

- [ ] Enumeration-sicher (identische Antworten/Zeiten, I-8)
- [ ] Re-Auth für sensible Aktionen (I-15); Session-Rotation bei Privilegienwechsel (I-14)
- [ ] Tokens: CSPRNG, nur Hash gespeichert, Ablauf, Einmalgebrauch, timing-safe Vergleich
- [ ] Security-Mail bei kontorelevanten Änderungen ([02 §7](../02-authentication-security.md))

## Uploads / Dateien

- [ ] Pipeline-Reihenfolge eingehalten (Validation → Security → Compression → Storage)
- [ ] Magic Bytes geprüft; Limits vor Decode; Ausgabe nur re-encodiert
- [ ] Storage-Keys generiert (keine Nutzer-Dateinamen/Pfade)

## Hintergrundjobs

- [ ] Idempotent (deterministische Job-ID, Regel M-6); Payload ohne Secrets
- [ ] Retry-/Dead-Letter-Verhalten definiert; Fehler landen nicht stumm im Nichts

## Datenbank

- [ ] Nur eigene Modul-Tabellen (B-1); Transaktionsgrenze bewusst (B-2, keine externen Calls darin)
- [ ] Raw SQL nur parametrisiert + begründet
- [ ] Neue personenbezogene Felder: Zweck begründet, Lösch-Kaskade ergänzt ([database/06](../../database/06-data-lifecycle-gdpr.md))

## Konfiguration & Secrets

- [ ] Secrets über Registry mit `encrypted: true`; nie loggen; UI write-only
- [ ] Neue ENV-Variablen in [deployment/04](../../deployment/04-configuration-reference.md) dokumentiert
