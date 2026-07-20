# E-10 · Media Management

**Status:** Verbindlich · **Phase:** 1–2 · **Priorität:** Must ·
**Module:** [media](../../../services/media-service.md) ·
**FRs:** FR-MEDI-001…008 · **ADR:** [ADR-0007](../../../architecture/decisions/adr-0007-storage-abstraction.md) ·
**Stories:** [user-stories.md](user-stories.md)

## Ziel

Bilder für Artikel, Profile, Organisationen und Projekte laufen durch eine **sichere,
performante Pipeline** (Validation → Security Check → Compression → Storage, Fachkonzept §7)
und liegen in einem **austauschbaren Storage-Backend** (Filesystem, S3-kompatibel, Azure Blob,
GCS) — mit modernen Formaten (WebP/AVIF), Größenvarianten und ohne Metadaten-Leaks.

## Scope

**Enthalten:**

- Upload-API mit Validierung (MIME-Allowlist, Magic Bytes, Größen-/Dimensionslimits, Quota)
- Asynchrone Verarbeitung mit Sharp: Re-Encode (Security), EXIF-Entfernung, Kompression,
  Varianten (thumb/content/original in WebP + AVIF + Fallback)
- Storage-Abstraktion: Adapter `filesystem`, `s3` (Phase 1), `azure-blob`, `gcs` (Phase 3)
- Auslieferung mit Cache-Headern, `srcset`-Auflösung in der Markdown-Pipeline
- Quotas pro Nutzer/Organisation; Orphan-Cleanup-Job
- SVG ausschließlich für Admin-Branding (sanitisiert)

**Nicht enthalten:** Video/Audio (nach 1.0), Anhänge beliebiger Dateitypen (Could, Phase 3+),
CDN-Integration (Betreiber-Thema, Deployment-Doku).

## Abhängigkeiten

Benötigt: Storage-Backend (Infrastruktur), BullMQ. Liefert an: E-04 (Artikelbilder),
E-07/E-08/E-09 (Avatare/Logos), E-01 (Branding).

## Erfolgsmetriken

- Bild ≤ 10 MB → `ready` in < 15 s (NFR-007), ohne API-Blockierung
- 100 % der ausgelieferten Varianten ohne EXIF/GPS-Daten (Testsuite)
- Polyglot-/Fake-Extension-Uploads werden zu 100 % abgelehnt (Security-Testfälle)

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Schadbild-Uploads (Polyglots, Dekompressionsbomben) | Magic-Bytes-Prüfung, Pixel-Limit vor Decode, Re-Encode-Pflicht, Quarantäne-Präfix |
| Storage-Kosten explodieren | Quotas, Orphan-Cleanup, Kompressionsziele |
| Adapter-Drift (FS vs. S3 verhalten sich verschieden) | Contract-Testsuite läuft gegen alle Adapter (testing/02) |
