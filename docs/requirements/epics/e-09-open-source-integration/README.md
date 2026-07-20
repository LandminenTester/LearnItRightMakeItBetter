# E-09 · Open-Source-Integration

**Status:** Verbindlich · **Phase:** 2 · **Priorität:** Must ·
**Module:** [repository](../../../services/repository-service.md) ·
**FRs:** FR-REPO-001…007, FR-KNOW-013 · **Stories:** [user-stories.md](user-stories.md)

## Ziel

Open-Source-Projekte werden auf der Plattform **präsentiert und automatisch aktuell gehalten**:
Projektseiten mit GitHub-Metadaten (Name, Sprachen, Stars, Forks, Aktivität, Releases) ohne
manuelle Pflege — „keine manuelle Verknüpfung zwingend erforderlich" (Fachkonzept §10) heißt:
Projekte funktionieren auch ganz ohne Repo-Verknüpfung.

## Scope

**Enthalten:**

- Projekte als Entität (Owner: Nutzer oder Organisation), Beschreibung (Markdown), Tags
- Optionale GitHub-Repository-Verknüpfung pro Projekt
- Automatischer Metadaten-Sync (Repeatable Job, ETag-basiert) + manueller Refresh
- Instanzweite GitHub-API-Konfiguration (Token/App); Betrieb ohne Token möglich
- Rate-Limit-Handling mit Backoff, Sync-Status sichtbar
- Verknüpfung Artikel ↔ Projekt (OSS-Wissen)
- Provider-Interface für spätere GitLab-/Gitea-Adapter (Could)

**Nicht enthalten:** Code-/Issue-Hosting, Webhook-Empfang von GitHub (nach 1.0 — Sync ist
Poll-basiert), Import von READMEs als Artikel (nach 1.0).

## Abhängigkeiten

Benötigt: E-02/E-08 (Owner), E-06 (Projekt-Index), E-11 (Fehler-Benachrichtigung).
Extern: GitHub REST API v3 (versioniert per `X-GitHub-Api-Version`).

## Erfolgsmetriken

- Sync hält 500 verknüpfte Repos auf Referenzinstanz mit Standard-Token-Limit (5.000 req/h)
  aktuell (ETag-Nutzung → 304 zählt reduziert)
- Rate-Limit-Erschöpfung führt zu 0 Nutzerfehlern (nur Verschiebung)
- Projektseite zeigt Sync-Zeitstempel; kein Wert älter als 2 × Intervall im Normalbetrieb

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| GitHub-Rate-Limits | ETags, Backoff bis `X-RateLimit-Reset`, Priorisierung aktiver Projekte |
| Repo gelöscht/privat geschaltet | Status `broken` + Owner-Benachrichtigung, keine stillen Nullwerte |
| Falsche Repo-Angabe (Squatting fremder Projekte) | Verifizierungshinweis; Moderation kann Verknüpfung lösen; keine Ownership-Behauptung durch Verknüpfung |
