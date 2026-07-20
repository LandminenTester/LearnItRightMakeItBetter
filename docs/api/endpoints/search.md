# API · search

**Fachregeln:** [services/search-service.md](../../services/search-service.md) ·
**Stories:** [E-06](../../requirements/epics/e-06-search-discovery/user-stories.md)

## Suche

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/search` | — (Ergebnisse berechtigungsgefiltert, S-1) | Volltextsuche. Parameter: `q`, `index` (`articles`\|`projects`\|`comments`, Default articles), Facetten (`type`, `space`, `category`, `tag`, `locale`, `status`), `sort`, `limit`/`offset` (max. 1000 Ergebnisse tief) |
| GET | `/search/suggest` | — (gefiltert) | Schnellvorschläge für Command Palette (gruppiert: Artikel, Projekte, Personen, Navigation; max. 3 je Gruppe) |

**Antwortform `GET /search`:**

```json
{
  "items": [ { "id": "article:…:de", "kind": "article", "title": "…", "snippet": "…<mark>NUI</mark>…", "url": "/s/basics/a/nui-focus", "meta": { "type": "troubleshooting", "space": "basics", "locale": "de", "helpfulCount": 12, "publishedAt": "…" } } ],
  "facets": { "type": { "how_to": 12, "troubleshooting": 8 }, "tag": { … } },
  "pageInfo": { "estimatedTotal": 42, "offset": 0, "limit": 25 }
}
```

Bei Meilisearch-Ausfall: 503 `search_unavailable` (Degradation S-6).

## Administration

| Methode | Pfad | Permission | Beschreibung |
|---|---|---|---|
| GET | `/admin/search/status` | `search.index.manage` | Index-Statistiken, letzter Konsistenz-Check, Queue-Tiefe |
| POST | `/admin/search/reindex/:index` | `search.index.manage` | Voll-Reindex mit Swap (202 + Statusressource, S-4) |
| GET | `/admin/search/reindex/:jobId` | `search.index.manage` | Fortschritt (n/total) |
