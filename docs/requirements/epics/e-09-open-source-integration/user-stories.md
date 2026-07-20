# E-09 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [repository-service.md](../../../services/repository-service.md)

## US-09-01 · Projekt anlegen (P4 Sofia) — FR-REPO-001 · Must

1. **Gegeben** die Projekt-Erstellung (Name, Slug, Beschreibung, Tags, Owner ich oder meine
   Org), **wenn** ich speichere, **dann** existiert eine öffentliche Projektseite — ganz ohne
   Repo-Verknüpfung.
2. **Gegeben** die Beschreibung, **dann** wird sie über die zentrale Markdown-Pipeline gerendert
   (gleiches Sanitizing wie Artikel).

## US-09-02 · Repo verknüpfen (P4 Sofia) — FR-REPO-002, 003 · Must

> Als Maintainerin möchte ich mein Projekt mit einem GitHub-Repo verknüpfen, damit die
> Projektseite aktuelle Daten zeigt, ohne dass ich sie pflege.

1. **Gegeben** `owner/repo`, **wenn** ich verknüpfe, **dann** startet sofort ein Erst-Sync und
   die Seite zeigt danach: Beschreibung, Primärsprache + Sprachverteilung, Stars, Forks, offene
   Issues, letzte Aktivität, neuestes Release, Lizenz — mit „Zuletzt synchronisiert"-Zeitstempel.
2. **Gegeben** ein nicht existierendes/privates Repo, **dann** schlägt die Verknüpfung mit
   konkreter Meldung fehl (kein toter Link entsteht).
3. **Gegeben** eine bestehende Verknüpfung, **wenn** ich sie löse, **dann** bleiben Projekt und
   Artikel-Verknüpfungen bestehen; nur die Metadaten verschwinden.

## US-09-03 · Automatisch aktuell (P4 Sofia) — FR-REPO-004, 006 · Must

1. **Gegeben** das konfigurierte Intervall (Default 6 h), **dann** aktualisiert der Sync alle
   Verknüpfungen; unveränderte Repos (ETag 304) verbrauchen minimales Rate-Limit.
2. **Gegeben** erschöpftes Rate-Limit, **dann** verschiebt sich der Sync bis zum Reset ohne
   Fehler für Endnutzer; der Status ist für mich als Owner einsehbar („verschoben bis …").
3. **Gegeben** „Jetzt aktualisieren" auf meiner Projektseite, **dann** läuft ein manueller Sync
   (Cooldown 5 min gegen Missbrauch).
4. **Gegeben** ein dauerhaft fehlschlagendes Repo (404/410), **dann** wird die Verknüpfung als
   `broken` markiert und ich werde einmalig benachrichtigt.

## US-09-04 · Instanz-Konfiguration (P7 Sam) — FR-REPO-005 · Must

1. **Gegeben** die Admin-Repository-Einstellungen, **wenn** ich ein GitHub-Token hinterlege
   (verschlüsselt gespeichert), **dann** validiert ein Testaufruf Token + Limits und zeigt das
   verfügbare Kontingent.
2. **Gegeben** kein Token, **dann** funktioniert der Sync mit den anonymen Limits (60 req/h) —
   die UI weist auf die Einschränkung hin.

## US-09-05 · Wissen mit Projekten verbinden (P4 Sofia, P1 Alex) — FR-KNOW-013 · Should

1. **Gegeben** ein Artikel vom Typ „Open-Source-Wissen", **wenn** ich ihn mit meinem Projekt
   verknüpfe, **dann** listet die Projektseite den Artikel und der Artikel zeigt die Projektbox
   (mit Live-Metadaten).
2. **Gegeben** die Suche nach dem Projektnamen, **dann** erscheinen Projektseite und verknüpfte
   Artikel gruppiert (E-06).
