# Runbook · Backup & Restore

**Bezug:** NFR-055 · [database/06 §5](../../database/06-data-lifecycle-gdpr.md)

## 1. Was gesichert wird

| Bestand | Methode | Häufigkeit (Empfehlung) |
|---|---|---|
| **PostgreSQL** (einzige fachliche Wahrheit) | `pg_dump -Fc` (Custom-Format) oder Operator-Backups/WAL | täglich voll; kritische Instanzen zusätzlich WAL/stündlich |
| **Media-Storage** | FS: rsync/Restic-Snapshot des Volumes · S3: Versioning + Replikation des Buckets | täglich bzw. Provider-kontinuierlich |
| **Konfiguration** | `.env` (bzw. K8s-Secrets-Export) — enthält 🔒-Werte: verschlüsselt ablegen, **getrennt** vom `APP_ENCRYPTION_KEY` | bei Änderung |
| Nicht nötig | Meilisearch (Reindex), Redis (Sessions verfallen; Queue-Verluste tolerierbar — AOF minimiert) | — |

Rotation: ≤ 35 Tage empfohlen (DSGVO-Abwägung); Aufbewahrung getestet, Restore-Rechte geklärt.

## 2. Backup (Compose, Beispiel)

```bash
docker compose exec -T postgres pg_dump -U lir -Fc lir > backup/lir_$(date +%F).dump
restic backup /srv/lir/media          # bei filesystem-Storage
cp .env backup/env_$(date +%F).enc    # verschlüsselt (age/gpg)
```

Automatisierung per Cron/systemd-Timer; Erfolg überwachen (Alert bei ausbleibendem Backup —
[monitoring](monitoring-alerting.md)).

## 3. Restore-Prozedur

1. Stack stoppen (`docker compose down`, Proxy-Wartungsseite optional `MAINTENANCE_MODE`).
2. PostgreSQL leeren/neu erstellen → `pg_restore -U lir -d lir --clean --if-exists lir_X.dump`.
3. Media-Volume/Bucket zurückspielen.
4. `.env` prüfen (gleicher `APP_ENCRYPTION_KEY` wie zum Backup-Zeitpunkt — sonst sind
   verschlüsselte Settings unlesbar → Neu-Eingabe der Secrets in Admin-UI).
5. Stack starten — `migrate` gleicht ggf. neuere Migrationen an (nur beim Restore in neuere
   Version; niemals in ältere Version restoren).
6. **DSGVO-Replay:** `platform recovery replay-deletions --since <backup-zeitpunkt>` — führt
   Löschungen erneut aus, die nach dem Backup beantragt wurden (deletion_marker,
   database/06 §5).
7. Suche neu aufbauen: `POST /admin/search/reindex/articles` (bzw. CLI `platform search:reindex --all`).
8. Verifikation: `/readyz` grün, Login, Artikel-Stichprobe, Media-Stichprobe, Testmail.

## 4. Teilwiederherstellung

Einzelne Inhalte: aus `pg_restore -l`-Liste selektiv in Staging restoren und fachlich
übertragen (keine Zeilen-Chirurgie in Produktion). Verlorene Media-Objekte ohne Backup:
Status `failed` setzen (`platform media:verify`) — Artikel zeigen Platzhalter statt Broken
Links.

## 5. Übung

Restore-Übung ist Pflicht vor Produktivgang und je Release-Phase: kompletter Durchlauf in
Staging inkl. Zeitmessung; Ergebnis im Betriebstagebuch der Instanz festhalten.
