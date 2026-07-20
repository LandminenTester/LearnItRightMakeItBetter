# Modul-Landkarte · media

**Zweck:** Sichere Bild-Pipeline (Validation → Security Check → Compression → Storage) mit
Sharp (Re-Encode, EXIF-Entfernung, WebP/AVIF-Varianten) und vollständiger Storage-Abstraktion
(Filesystem, S3-kompatibel; Azure Blob/GCS in Phase 3) inkl. Quotas und Orphan-Cleanup.

## Datenhoheit

`MediaObject`, `MediaUsage` + Objekte im Storage-Backend (`media/<shard>/<id>/<variant>`)

## Kanten

| Richtung | Beziehung |
|---|---|
| nutzt | `identity`/`organization` (Owner/Quota), `authorization`, `audit`, `configuration` (Limits/Driver) |
| wird genutzt von | `knowledge` (`resolveVariants` für `srcset`), `identity` (Avatar), `organization` (Logo), `repository` (Projektbild), `configuration` (Branding, SVG-Sonderfall) |
| publiziert | `media.object.ready`, `media.object.rejected`, `media.object.deleted` |
| Infrastruktur | `StorageProvider`-Adapter ([ADR-0007](../decisions/adr-0007-storage-abstraction.md)) |

## Themenbereich-Dokumente

| Aspekt | Dokument |
|---|---|
| Spezifikation (Pipeline, Regeln MD-1…MD-5) | [services/media-service.md](../../services/media-service.md) |
| Epic + Stories | [E-10 Media Management](../../requirements/epics/e-10-media-management/README.md) |
| Storage-Entscheidung | [ADR-0007 Storage-Abstraktion](../decisions/adr-0007-storage-abstraction.md) |
| Datenbankschema | [database/schemas/media.md](../../database/schemas/media.md) |
| API-Endpunkte | [api/endpoints/media.md](../../api/endpoints/media.md) |
| Upload-Datenfluss | [architecture/05 §5](../05-data-flows.md) |
| Upload-Security | [security/05 Application Security](../../security/05-application-security.md) |
