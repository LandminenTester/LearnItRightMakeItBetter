# API · media

**Fachregeln:** [services/media-service.md](../../services/media-service.md) ·
**Stories:** [E-10](../../requirements/epics/e-10-media-management/user-stories.md)

## Upload & Zugriff

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| POST | `/media` | `media.object.create` (+ Kontext-Recht des Ziels) | Multipart-Upload `{ file, kind, context? }` → 202 `{ mediaId, status: "processing" }` (Pipeline-Schritte 1–2) |
| GET | `/media/:id` | Owner bzw. sichtbarkeitsabhängig | Metadaten + Status + Varianten-URLs (Editor-Polling bis `ready`) |
| GET | `/media/:id/file/:variant` | sichtbarkeitsabhängig (MD-2) | Auslieferung (Streaming bzw. 302 Signed URL); `immutable`-Caching |
| DELETE | `/media/:id` | Owner bzw. `media.object.manage` | Löschen (blockiert bei aktiver Verwendung in publizierten Inhalten — Hinweis mit Verwendungsliste) |
| GET | `/users/me/media` | auth | Eigene Uploads (Filter: kind, status) + Quota-Anzeige |

**Upload-Fehlercodes:** 413 `file_too_large`, 415 `unsupported_media_type` (Allowlist/Magic
Bytes), 422 `quota_exceeded` (mit belegt/verfügbar), 422 `dimensions_exceeded`.

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/media/overview` | `media.settings.manage` | Belegung je Backend, Top-Verbraucher, Fehlerquote (US-10-04.3) |
| PUT | `/admin/media/settings` | `media.settings.manage` | Limits (Maxgröße, Pixel), Quotas |
| POST | `/admin/media/branding` | `configuration.branding.manage` | Branding-Assets inkl. SVG (sanitisiert, MD-1) |
| POST | `/admin/media/cleanup` | `media.settings.manage` | Orphan-Cleanup manuell anstoßen (202) |
