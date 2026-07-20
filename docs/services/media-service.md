# Media Service

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**FRs:** FR-MEDI-001…008 · **ADR:** [ADR-0007](../architecture/decisions/adr-0007-storage-abstraction.md) ·
**Epic:** [E-10](../requirements/epics/e-10-media-management/README.md) ·
**Schema:** [database/schemas/media.md](../database/schemas/media.md)

## 1. Zweck & Verantwortlichkeiten

- Upload-API und verbindliche Pipeline **Validation → Security Check → Compression → Storage**
- Bildverarbeitung mit **Sharp**: Re-Encode, EXIF-/Metadaten-Entfernung, Kompression,
  Größenvarianten, WebP/AVIF
- **Storage-Abstraktion** (`StorageProvider`): `filesystem`, `s3` (1.0); `azure-blob`, `gcs`
  (Phase 3)
- Auslieferung (Streaming/Redirect zu Signed URLs) mit Cache-Headern
- Referenzverwaltung (`MediaUsage`), Quotas, Orphan-Cleanup

## 2. Abgrenzung

Markdown-`srcset`-Auflösung macht `knowledge` (nutzt `MediaPort`); Avatar-/Logo-Zuordnung
liegt bei `identity`/`organization` (speichern nur `mediaId`).

## 3. Domänenmodell

- `MediaObject` — `ownerId`, `orgId?`, `originalFilename`, `mimeType`, `sizeBytes`,
  `checksumSha256`, `status` (`processing`|`ready`|`failed`|`quarantined`), `storageDriver`,
  `storageKeyBase`, `width`, `height`, `variants` (JSON: je Variante format, width, sizeBytes,
  key), `kind` (`content`|`avatar`|`logo`|`branding`), `visibility` (erbt vom Verwendungsort),
  `createdAt`, `deletedAt?`.
- `MediaUsage` — (`mediaId`, `resourceType`, `resourceId`) — Referenzzähler für Cleanup.

## 4. Fachliche Regeln

### Pipeline (verbindliche Reihenfolge, FR-MEDI-002)

1. **Validation (synchron im Request):** Auth + Ziel-Permission, MIME-Allowlist
   (`image/png`, `image/jpeg`, `image/webp`, `image/avif`, `image/gif`), Größenlimit (Default
   10 MB), **Magic-Bytes-Prüfung** gegen deklarierten Typ, Quota-Prüfung.
2. **Quarantäne:** Original unter `quarantine/`-Präfix; `status = processing`; Antwort `202`
   mit `mediaId`.
3. **Security Check (Job):** Pixel-Dimensions-Limit **vor** Decode (Bomben-Schutz, Default
   40 MP), vollständiger Re-Decode via Sharp — nicht dekodierbare/inkonsistente Dateien ⇒
   `failed`; auffällige (Polyglot-Verdacht) ⇒ `quarantined` + Audit.
4. **Compression & Varianten:** Ausgabe **ausschließlich re-encodiert** (nie Original-Bytes
   ausliefern): `thumb` (320 px), `content` (1280 px), `large` (2048 px, nur wenn Quelle größer)
   je als WebP + AVIF + Fallback (JPEG/PNG); GIF: animiert ⇒ nur Größenbegrenzung + WebP-Anim.
   Alle Metadaten (EXIF/GPS/ICC außer sRGB) entfernt.
5. **Storage:** Varianten unter `media/<shard>/<mediaId>/<variant>.<ext>`; Quarantäne-Objekt
   löschen; `status = ready`; Event `media.object.ready`.

### Weitere Regeln

- **MD-1:** SVG nur `kind = branding`, nur durch `configuration.branding.manage`, mit
  SVG-Sanitizer (Scripts/Event-Handler/extern refs entfernt) (FR-MEDI-006).
- **MD-2:** Auslieferung: `filesystem` streamt durchs Backend; `s3`/Blob nutzt Signed URLs
  (Fallback Streaming, ADR-0007) — beides mit `Cache-Control: public, max-age=31536000,
  immutable` (Keys sind content-addressiert stabil) für öffentliche, `private` für geschützte
  Medien; Zugriffsprüfung vor jeder Auslieferung nicht-öffentlicher Medien.
- **MD-3:** Quotas (FR-MEDI-007): Default 500 MB/Nutzer, 5 GB/Org (konfigurierbar); zählt
  `ready`-Varianten + Originalgröße.
- **MD-4:** Orphan-Cleanup (FR-MEDI-008): `ready` ohne `MediaUsage` und älter 30 Tage ⇒
  Soft-Delete; endgültig nach weiteren 14 Tagen. Editor-Uploads erhalten sofort eine
  provisorische Usage (`draft:<articleId>`), die beim Verwerfen des Entwurfs fällt.
- **MD-5:** Idempotenz: gleicher `checksumSha256` + Owner + kind ⇒ vorhandenes Objekt wird
  wiederverwendet (Dedupe).

## 5. Schnittstellen

**API (Auszug):** `POST /media` (multipart), `GET /media/:id` (Metadaten + Varianten-URLs),
`GET /media/:id/file/:variant` (Auslieferung), `DELETE /media/:id`, Admin:
`/admin/media/overview`.

**Publizierte Events:** `media.object.ready`, `media.object.rejected` (failed/quarantined),
`media.object.deleted`.

**Ports:** `MediaPort.resolveVariants(mediaIds[])` (Markdown-Rendering),
`MediaPort.attachUsage/detachUsage`, `MediaPort.setAvatar(userId, mediaId)` u. ä.

## 6. Hintergrundjobs

| Job | Queue | Zweck |
|---|---|---|
| `process-image` | media | Pipeline-Schritte 3–5 (CPU-limitierte Concurrency) |
| `cleanup-orphan-media` | maintenance | MD-4 (wöchentlich) |
| `purge-deleted-media` | maintenance | endgültiges Löschen im Storage |

## 7. Konfiguration

`STORAGE_DRIVER` + Provider-Credentials (ENV, → [deployment/04](../deployment/04-configuration-reference.md));
Limits (Maxgröße, Pixel, Quotas) als Instanzeinstellungen.

## 8. Sicherheit

Upload ist ein Hauptangriffsvektor: Magic Bytes + Re-Encode-Pflicht + Pixel-Limits + Quarantäne
(siehe Pipeline). Content-Disposition und eigener Media-Pfad (`/media`) verhindern
HTML-Interpretation; `X-Content-Type-Options: nosniff` global (security/05). Pfad-Traversal
unmöglich durch generierte Keys (nie Nutzer-Dateinamen im Key).

## 9. Offene Punkte

- Presigned-Direct-Uploads (Client → S3) als Skalierungsoption — Stufe 4 der Evolution.
- Bildbeschnitt/Fokuspunkt für Avatare — UX-Verbesserung nach 1.0.
