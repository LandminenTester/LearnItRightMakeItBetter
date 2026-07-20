# ADR-0005: Meilisearch als Suchtechnologie

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Die Suche ist Kernfunktion (E-06): Volltext über Artikel, Übersetzungen, Kommentare und
Repository-Daten mit Filtern, Ranking, Facetten und Typo-Toleranz (FR-SRCH-001…008), p95 < 200 ms
(NFR-003), betreibbar auf der Self-Hosting-Referenz. Das Fachkonzept (§7) legt Meilisearch fest.

## Entscheidung

**Meilisearch 1.x** als dedizierter Suchdienst. Indizes pro Dokumenttyp (`articles`, `projects`,
`comments`); ein Dokument pro Sprachfassung; denormalisierte Sichtbarkeitsfelder für
berechtigungsbewusste Queries. Indexierung ausschließlich asynchron über die
`search-index`-Queue; Meilisearch ist **abgeleiteter Zustand** — vollständig aus PostgreSQL
rekonstruierbar (FR-SRCH-007).

## Betrachtete Alternativen

- **PostgreSQL-Volltext (tsvector)** — abgelehnt als Primärlösung: schwaches Ranking/Typo-Handling,
  Facetten aufwendig; bleibt Degradations-Fallback-Idee, wird aber nicht doppelt gepflegt.
- **Elasticsearch/OpenSearch** — abgelehnt: Ressourcenbedarf sprengt die Self-Hosting-Referenz;
  Betriebskomplexität.
- **Typesense** — gleichwertige Klasse, aber Konzeptvorgabe und Team-Vertrautheit sprechen für
  Meilisearch.

## Konsequenzen

- ✅ Sehr gute Relevanz/Typo-Toleranz out-of-the-box, geringer Betriebsaufwand, ein Container.
- ✅ Verlust des Suchindex ist unkritisch (Reindex-Job) → einfaches Backup-Konzept
  (nur PostgreSQL + Storage, → [Runbook Backup/Restore](../../deployment/runbooks/backup-restore.md)).
- ⚠️ Sichtbarkeitsfilter MÜSSEN Teil jeder Query sein (kein nachträgliches Filtern,
  → [security/03](../../security/03-authorization-enforcement.md)); Sichtbarkeitsänderungen
  triggern Reindex der betroffenen Dokumente.
- ⚠️ Instanz muss Ausfall von Meilisearch degradiert überleben (NFR-014): Artikel bleiben über
  direkte Navigation erreichbar, Suche zeigt Wartungshinweis.
