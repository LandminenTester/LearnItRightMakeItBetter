# Application Security

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Input-Validierung

- **Am Rand:** Jede Request-Payload läuft durch Zod (Regel B-3) — Typ, Länge, Format, Enum;
  unbekannte Felder werden abgelehnt (`strict()`), keine stillschweigende Übernahme.
- **In der Fachlogik:** Wertebereichs-/Konsistenz-/Zustandsprüfungen zusätzlich im Service
  (Client nie vertrauen) — z. B. `basedOnVersionId` gehört zum Artikel, Kategorie zum Space.
- Externe Antworten (OAuth-Profile, GitHub-API) sind gleichrangig untrusted → Zod-Validierung
  vor Verwendung.
- Datei-Uploads: eigene Pipeline (→ §5).

## 2. XSS-Prävention

**Primärvektor: nutzergenerierter Markdown** (Artikel, Übersetzungen, Kommentare, Bio,
Projektbeschreibungen).

- **Eine** serverseitige Render-Pipeline (ADR-0012): remark/rehype → HTML →
  **Sanitisierung per Allowlist** (Tags: Struktur, Code, Tabellen, Admonition-Container;
  Attribute: minimal; `class` nur aus Pipeline-eigenem Satz). Rohes HTML im Markdown wird
  escaped, nie interpretiert.
- Links: nur `http(s):`/`mailto:`/relative; `rel="nofollow noopener noreferrer"` für extern;
  `javascript:`/`data:`-URIs verworfen. Bilder nur über `media:`-Referenzen (K-15).
- Vue-Ausgabe: gerendertes HTML ausschließlich in der dafür vorgesehenen
  `ArticleContent`-Komponente (`v-html` sonst per Lint verboten); alle übrigen Ausgaben sind
  interpolationsbasiert (auto-escaped).
- **CSP** (Report-Only in Staging, Enforce in Produktion):
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: <storage-host>; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`
  — `unsafe-inline` für Styles wegen Nuxt-SSR akzeptiert, Skripte niemals inline.
- Fuzz-/Corpus-Tests der Pipeline (XSS-Payload-Sammlungen) in CI (testing/02).

## 3. CSRF

Double-Submit (Session-gebundenes Token, `X-CSRF-Token`-Header, → [api/02 §3](../api/02-authentication-and-tokens.md))
+ `SameSite=Lax` als zweite Schicht. State-ändernde Endpunkte nur via POST/PATCH/PUT/DELETE —
niemals GET. PAT-Requests (Header-Auth) sind CSRF-frei by design.

## 4. SSRF

| Oberfläche | Schutz |
|---|---|
| GitHub-Sync | Ziel-URL fest konfiguriert (API-Basis), keine nutzergesteuerten URLs (R-Design) |
| Webhooks (Phase 3) | URL-Validierung: nur `https:`, DNS-Auflösung geprüft gegen private/reservierte Bereiche (RFC 1918, ::1, 169.254.0.0/16, …), Re-Resolve beim Senden (DNS-Rebinding), keine Redirect-Verfolgung, Timeout 10 s (N-7) |
| OIDC-Discovery | nur bei Admin-Konfiguration; gleiche Privatnetz-Sperre; Antwortgröße limitiert |
| Markdown | keine serverseitigen Fetches von Nutzer-URLs (externe Bilder werden nicht proxied, K-15) |

## 5. Upload-Security (Zusammenfassung — Details [services/media](../services/media-service.md))

MIME-Allowlist + Magic-Bytes-Abgleich → Größen-/Pixel-Limits vor Decode → Quarantäne-Präfix →
Re-Encode-Pflicht (ausgeliefert wird nie das Original) → Metadaten-Strip → content-addressierte
Keys (kein Pfad-Traversal, keine Nutzer-Dateinamen) → `X-Content-Type-Options: nosniff` +
korrekte `Content-Type`/`Content-Disposition`. SVG nur Admin-Branding nach Sanitizer (MD-1).

## 6. Security-Header (global, NFR-020)

| Header | Wert |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | siehe §2 |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (+ CSP `frame-ancestors 'none'`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` (Media-Endpunkte: `cross-origin` nur falls Instanz es konfiguriert) |

Header-Vollständigkeit wird per E2E-Smoke-Test geprüft (testing/04).

## 7. Injection & sonstige Klassiker

- **SQL:** ausschließlich Prisma bzw. parametrisierte `$queryRaw`-Template-Tags (MIG-§5);
  String-Konkatenation in SQL ist per Review + Semgrep-Regel verboten.
- **NoSQL/Query-Smuggling:** Meilisearch-Filter werden aus typisierten Parametern gebaut
  (S-7), nie aus Roh-Strings des Clients.
- **Command Injection:** keine Shell-Aufrufe im Request-Pfad; Sharp/Bibliotheken statt CLI-Tools.
- **Path Traversal:** Storage-Keys generiert (MD-Pipeline), FS-Adapter verweigert `..`/absolute
  Pfade defensiv.
- **Prototype Pollution:** `Object.create(null)`/Zod-Parsing; JSON-Merge-Utilities aus
  geprüfter Lib.
- **ReDoS:** keine Nutzer-Regexes; eigene Regexes linear (Lint re2-Prüfung für kritische
  Pfade).
- **Fehler-Hygiene:** Problem Details ohne Stacktraces/Interna (api/01 §3); Debug-Modus nie in
  Produktion (Config-Guard).
