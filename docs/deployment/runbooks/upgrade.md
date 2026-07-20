# Runbook · Upgrade

**Bezug:** NFR-052, [database/05 §2](../../database/05-prisma-and-migrations.md) (MIG-Regeln)

## 1. Vor jedem Upgrade

1. Release Notes lesen — besonders Abschnitte „Breaking/Migrationshinweise" und
   „Sicherheitsrelevant".
2. Backup ziehen ([backup-restore.md](backup-restore.md)) — Pflicht, kein „geht schon".
3. Versionssprünge: nur sequenzielle Minor-Releases überspringen, wenn Release Notes es
   erlauben; Major-Upgrades niemals überspringen.
4. Staging zuerst (falls vorhanden): Upgrade dort durchspielen inkl. Smoke-Test.

## 2. Compose (Single Node — kurze definierte Downtime)

```bash
# 1. Version setzen
sed -i 's/^LIR_VERSION=.*/LIR_VERSION=1.5.0/' .env
# 2. Images ziehen (Downtime beginnt erst beim up)
docker compose -f compose.prod.yml pull
# 3. Rollout — migrate läuft automatisch vor App-Start
docker compose -f compose.prod.yml up -d
# 4. Verifizieren
curl -fsS https://<host>/api/v1/healthz && docker compose logs backend --since 5m | grep -i error
```

Downtime typisch < 60 s (Migrationsdauer beachten — lange Migrationen kündigen Release Notes
an).

## 3. Kubernetes (Zero-Downtime)

Ablauf gemäß [03-kubernetes.md §5](../03-kubernetes.md): Image-Tags im Overlay anheben →
`migrate`-Job (Gate) → RollingUpdate → Post-Checks (readyz, Smoke, Queues). GitOps-Betrieb:
Tag-Bump als PR, Sync-Wave migrate → apps.

## 4. Nach dem Upgrade

- Admin-Systemseite: Version + Migrationsstatus prüfen (US-13-05).
- Smoke: Login, Artikel öffnen, Suche, Media-Abruf, Testmail.
- Bei neuen Instanzeinstellungen (Release Notes) Admin-UI durchgehen.
- Härtungs-Checkliste kurz gegenprüfen (neue Ports/Dienste?).

## 5. Rollback

**Fenster:** Innerhalb eines Releases sind Migrationen vorwärtskompatibel zum Vorgänger
(MIG-3 expand/contract) ⇒ Image-Rollback auf das vorherige Tag ist ohne DB-Rollback möglich:

```bash
sed -i 's/^LIR_VERSION=.*/LIR_VERSION=1.4.2/' .env && docker compose up -d backend worker frontend
```

**Nicht möglich:** DB auf alten Stand „zurückmigrieren" (keine Down-Migrationen, MIG-1).
Wenn ein Release die Daten fachlich beschädigt hat ⇒ Restore vom Backup vor dem Upgrade
([backup-restore.md §3](backup-restore.md)) und Fehler-Report an das Projekt.

## 6. Sicherheits-Updates

Advisory-Releases (Patch) sofort einspielen; sie enthalten keine Migrations-Überraschungen
(Projekt-Zusage in [security/08 §2](../../security/08-incident-response-recovery.md)).
