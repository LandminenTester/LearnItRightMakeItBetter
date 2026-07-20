# Checkliste · Deployment-Härtung (Betreiber)

**Status:** Verbindlich · Bei Installation und jedem Upgrade; im Release-Test automatisiert
geprüft, wo möglich. Kontext: [deployment/](../../deployment/README.md).

## Netzwerk & Transport

- [ ] Nur Reverse Proxy (80/443) öffentlich; PostgreSQL, Redis, Meilisearch, MinIO **nicht**
      von außen erreichbar (Compose-Netz / K8s NetworkPolicy)
- [ ] TLS aktiv (gültiges Zertifikat, Auto-Renewal); HTTP → HTTPS Redirect; HSTS greift
- [ ] `APP_URL` = öffentliche HTTPS-URL (Setup-Check C-6 grün)

## Secrets & Schlüssel

- [ ] `APP_ENCRYPTION_KEY`, `SESSION_SECRET`, `AUTH_PEPPER`: einzigartig, ≥ 32 B Zufall,
      aus Secret-Store/ENV — nie im Repo/Image
- [ ] `MEILI_MASTER_KEY`, DB-/SMTP-/S3-Zugangsdaten gesetzt und nicht Default
- [ ] Encryption-Key getrennt vom DB-Backup aufbewahrt ([security/04 §2](../04-data-protection-privacy.md))

## Datenbank & Dienste

- [ ] Eigener DB-User für die App (kein Superuser); Audit-Härtung: kein UPDATE/DELETE-Grant
      auf `audit_events` (AU-1)
- [ ] Redis: `requirepass` gesetzt, AOF `everysec` aktiv ([ADR-0006](../../architecture/decisions/adr-0006-redis-bullmq.md))
- [ ] Meilisearch: Master-Key gesetzt, kein öffentlicher Port
- [ ] Storage-Bucket privat (kein Public-Read); Zugriff nur via App/Signed URLs

## Container

- [ ] Images laufen als non-root; `read_only`-Rootfs wo möglich; Ressourcen-Limits gesetzt
- [ ] Nur Release-Tags/Digests deployen (kein `latest`); Trivy-Scan des deployten Images grün
- [ ] Log-Rotation des Runtimes konfiguriert (json-file limits / Log-Collector)

## Anwendung

- [ ] Setup abgeschlossen; `/setup` liefert 403; erster Admin hat MFA aktiviert
- [ ] Registrierungsmodus bewusst gewählt; Modul-Flags entsprechen dem Einsatzzweck
- [ ] SMTP-Testmail erfolgreich; SPF/DKIM/DMARC für Absenderdomain gesetzt (Runbook)
- [ ] Backups eingerichtet **und Restore einmal getestet** ([Runbook](../../deployment/runbooks/backup-restore.md));
      Rotation dokumentiert (≤ 35 Tage empfohlen, DSGVO)
- [ ] `/metrics` nur intern erreichbar (Scrape-Netz); Health-Checks im Orchestrator aktiv
- [ ] Update-Kanal geklärt: Release Notes abonniert (Security-Advisories)
