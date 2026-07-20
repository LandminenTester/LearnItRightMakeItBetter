# E-10 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [media-service.md](../../../services/media-service.md)

## US-10-01 · Bild im Artikel (P1 Alex) — FR-MEDI-001…004 · Must · Phase 1

1. **Gegeben** ein Bild-Upload (8 MB PNG) im Editor (Drag & Drop oder Auswahl), **wenn** die
   Pipeline durchläuft, **dann** erscheint das Bild im Artikel; ausgeliefert werden WebP-/
   AVIF-Varianten passender Größe via `srcset`, ohne EXIF-Daten.
2. **Gegeben** der Verarbeitungszeitraum, **dann** zeigt der Editor einen Platzhalter mit
   Status; nach `ready` ersetzt er sich automatisch (Event `media.object.ready`).
3. **Gegeben** ein Upload über dem Limit (Default 10 MB) oder außerhalb der Allowlist, **dann**
   wird er sofort mit konkreter Meldung abgelehnt.

## US-10-02 · Gefälschte Dateien abwehren (Sicherheit) — FR-MEDI-002 · Must · Phase 1

1. **Gegeben** eine Datei mit `.png`-Endung, aber ausführbarem Inhalt, **wenn** die Validierung
   läuft, **dann** wird der Upload abgelehnt (Magic Bytes ≠ deklarierter Typ) und das Ereignis
   als `media.object.rejected` auditiert.
2. **Gegeben** eine Dekompressionsbombe (extreme Pixelmaße), **dann** bricht die Verarbeitung
   vor dem vollständigen Decode ab (Pixel-Limit); Status `failed`, Quarantäne-Objekt entfernt.

## US-10-03 · Avatar & Logos (P1, P5) — FR-MEDI-001 · Must · Phase 1

1. **Gegeben** mein Avatar-Upload, **wenn** er verarbeitet ist, **dann** erscheint er überall
   (Profil, Kommentare, Reviews) in passender Größe; das Vorgängerbild wird zur Löschung
   markiert.
2. **Gegeben** ein Org-Logo, **dann** gelten dieselben Regeln mit Org-Quota (FR-MEDI-007).

## US-10-04 · Speicher unter Kontrolle (P7 Sam) — FR-MEDI-007, 008 · Should · Phase 2

1. **Gegeben** eine konfigurierte Quota (Default 500 MB/Nutzer, 5 GB/Org), **wenn** ein Upload
   sie überschreiten würde, **dann** wird er mit Anzeige des belegten/verfügbaren Speichers
   abgelehnt.
2. **Gegeben** der wöchentliche Orphan-Cleanup, **dann** entfernt er Medien ohne Referenz, die
   älter als 30 Tage sind — mit Audit-Zusammenfassung (Anzahl, Volumen).
3. **Gegeben** die Admin-Media-Übersicht, **dann** sehe ich Gesamtbelegung pro Storage-Backend
   und Top-Verbraucher.

## US-10-05 · Storage wechseln (P7 Sam) — FR-MEDI-004, 005 · Must (S3) / Should (Blob) 

1. **Gegeben** `STORAGE_DRIVER=s3` mit MinIO-Zugangsdaten, **wenn** der Setup-Wizard-Test
   (Schreiben/Lesen/Löschen) grün ist, **dann** laufen alle Uploads über S3 — ohne Verhaltensunterschied
   zur Filesystem-Variante (Adapter-Contract).
2. **Gegeben** ein geplanter Backend-Wechsel, **dann** beschreibt das Runbook
   ([deployment/runbooks](../../../deployment/runbooks/README.md)) den Migrationsweg
   (CLI `storage:migrate`, Phase 3).
