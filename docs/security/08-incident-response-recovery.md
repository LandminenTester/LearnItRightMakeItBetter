# Incident Response & Recovery

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20 ·
**Recovery-Stories:** [E-13](../requirements/epics/e-13-operations-recovery/user-stories.md) ·
**Betriebs-Runbook:** [deployment/runbooks/incident-recovery.md](../deployment/runbooks/incident-recovery.md)

## 1. Rollen & Geltung

Dieses Dokument regelt (a) den Umgang mit Sicherheitsvorfällen im **Projekt** (Codebasis,
Releases) und (b) die eingebauten **Recovery-Mechanismen** jeder Instanz. Betreiber-seitige
Incident-Prozesse (wer wird intern alarmiert etc.) definiert der Betreiber; das Runbook liefert
die technischen Schritte.

## 2. Responsible Disclosure (Projekt)

- `SECURITY.md` im Repo-Root: Meldweg (security@…-Postfach des Projekts), Verschlüsselung
  (Alter-/PGP-Key), Reaktionszusage: Eingangsbestätigung ≤ 48 h, Erstbewertung ≤ 5 Werktage.
- Koordinierte Veröffentlichung: Fix vor Details; Security-Releases als Patch-Version mit
  Advisory (GitHub Security Advisory + Release Notes „Sicherheitsrelevant — Update empfohlen").
- Keine Bug-Bounty-Zusage in 1.0 (Anerkennung in Advisory Credits).

## 3. Schweregrade & Reaktion (Projekt)

| Grad | Beispiel | Reaktion |
|---|---|---|
| **Critical** | RCE, AuthZ-Bypass auf private Inhalte, Secret-Leak im Release | Fix-Release so schnell wie möglich; Advisory; ggf. Hinweis auf Sofortmaßnahmen (Feature per Modul-Flag deaktivieren) |
| **High** | Stored XSS, IDOR einzelner Ressourcen, CSRF auf sensible Aktion | Fix ≤ 7 Tage, Advisory |
| **Medium/Low** | Race Conditions ohne Datenleck, Header-Härtung | nächstes reguläres Release |

## 4. Vorfallbehandlung einer Instanz (Kurzleitfaden → Runbook für Details)

1. **Eindämmen:** kompromittierte Konten sperren (`/admin/users`), Sessions global widerrufen,
   betroffene Provider/Webhooks deaktivieren, bei Bedarf `MAINTENANCE_MODE=true`.
2. **Beweise sichern:** Audit-Export des Zeitraums, Logs sichern (stdout-Aggregat), DB-Snapshot.
3. **Analysieren:** Audit-Log (Actor/IP/Aktionen), `requestId`-Korrelation in Logs.
4. **Bereinigen:** Secrets rotieren (`APP_ENCRYPTION_KEY`-Rotation §-Verfahren, OAuth-Secrets,
   SMTP, GitHub-Token, `SESSION_SECRET` ⇒ globale Abmeldung), Passwort-Resets erzwingen
   (CLI), Schadinhalte depublizieren (auditiert).
5. **Wiederherstellen:** ggf. Restore gemäß [Backup-Runbook](../deployment/runbooks/backup-restore.md)
   inkl. `replay-deletions`.
6. **Nachbereiten:** Post-Mortem; erkannte Lücken als Issues mit Security-Label; ggf. Meldung
   an Betroffene/Behörden (DSGVO Art. 33/34 — Betreiberpflicht, Vorlage im Runbook).

## 5. Eingebaute Recovery-Mechanismen (alle auditiert, FR-PLAT-006)

| Mechanismus | Zugang | Absicherung |
|---|---|---|
| **Admin-Recovery** | Recovery Codes aus Setup; normale Reset-Flows | Codes gehasht, Einmalgebrauch, Security-Mail (US-13-02) |
| **CLI-Recovery** `platform recovery …` | nur mit System-/Container-Zugriff | jede Aktion mit `--reason`, `critical`-Audit, Nutzer-Benachrichtigung (US-13-03): `reset-password`, `disable-mfa`, `disable-provider`, `create-emergency-admin`, `replay-deletions` |
| **Emergency Access** | CLI-erzeugtes Break-Glass-Konto | 24 h Ablauf, Warnbanner, erhöhtes Audit, Mail an alle Admins, endgültige Entwertung (US-13-01) |

**Grundsatz:** Kein Recovery-Weg umgeht das Audit; kein Recovery-Weg existiert als
unauthentifizierte Web-Route. Wer die Maschine kontrolliert, kontrolliert die Instanz — das
CLI macht diesen Fakt kontrolliert und nachvollziehbar statt ihn zu verstecken.

## 6. Übungen

Pro Release-Phase (M1–M3) wird je ein Szenario real durchgespielt und im Runbook abgehakt:
M1 Backup-Restore; M2 Vollständige Aussperrung (US-13-01); M3 Secret-Rotation + simulierte
Kompromittierung eines Admin-Kontos.
