# ADR-0007: Storage-Abstraktion mit Provider-Adaptern

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Medien müssen je nach Installation im lokalen Filesystem (Entwicklung, kleine Instanzen), in
S3-kompatiblen Diensten (Hetzner Object Storage, AWS S3, MinIO, Cloudflare R2) oder in
Blob-Storages (Azure Blob, Google Cloud Storage) liegen (Fachkonzept §7, FR-MEDI-004/005) —
ohne dass Fachcode den Anbieter kennt.

## Entscheidung

Das Media-Modul definiert ein schmales **`StorageProvider`-Interface**
(`put`, `get`, `delete`, `exists`, `getSignedUrl?`, `healthCheck`), Architektur:

```
Media Service → Storage Interface → Provider Adapter → Storage Backend
```

Adapter in 1.0: `filesystem`, `s3` (deckt alle S3-kompatiblen ab, inkl. MinIO/R2/Hetzner);
Phase 3: `azure-blob`, `gcs`. Auswahl und Zugangsdaten ausschließlich per Konfiguration
(`STORAGE_DRIVER`, → [deployment/04](../../deployment/04-configuration-reference.md)).
Objekt-Keys sind provider-neutral (`media/<shard>/<id>/<variant>.<ext>`).

## Betrachtete Alternativen

- **Direkte S3-Nutzung überall (FS nur via MinIO)** — abgelehnt: kleine Instanzen sollen ohne
  zusätzlichen Dienst laufen können; Dev-Setup einfacher mit FS-Option, MinIO bleibt Dev-Default
  für S3-Pfad-Tests.
- **Fertige Multi-Storage-Bibliothek (flydrive o. ä.)** — abgelehnt als Kern-Abhängigkeit: das
  Interface ist klein; eigene Adapter halten Sicherheitsanforderungen (Quarantäne-Präfix,
  Checksummen) unter Kontrolle.

## Konsequenzen

- ✅ Anbieterwechsel = Konfigurationsänderung + Datenmigration, kein Codeeingriff (NFR-044).
- ✅ Setup Wizard kann jeden Adapter mit Lese-/Schreibtest validieren (FR-CONF-001).
- ⚠️ Kleinster gemeinsamer Nenner: Features wie Presigned Uploads sind optional
  (`getSignedUrl?`) — Fachcode muss den Fallback (Upload durchs Backend) immer unterstützen.
- ⚠️ Migrations-Werkzeug zwischen Backends wird als CLI-Kommando eingeplant
  (`storage:migrate`, Phase 3).
