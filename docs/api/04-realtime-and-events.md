# Realtime & Events (Vorbereitung)

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

Das Fachkonzept (§7) sieht WebSockets/Event-Kommunikation als **Vorbereitung** vor. 1.0
liefert bewusst Polling; die Architektur hält den Upgrade-Pfad offen, ohne ihn vorwegzunehmen.

## 1. Stand 1.0 — Polling

| Bedarf | Mechanik |
|---|---|
| In-App-Notification-Zähler | `GET /notifications/unread-count` alle 30 s (nur sichtbarer Tab — `visibilitychange` pausiert) |
| Job-/Prozess-Status (Media, Reindex, Export, Sync) | Status-Ressource des jeweiligen Endpunkts, Polling mit Backoff (2 s → 10 s) |
| Review-Queues, Dashboards | Refresh bei Navigation/Fokus; kein Hintergrund-Polling |

ETag/304 (→ [01-api-conventions.md §7](01-api-conventions.md)) hält Polling billig.

## 2. Vorbereitete Architektur

- **Ereignisquelle:** Die Domain Events ([architecture/02 §5](../architecture/02-module-boundaries.md))
  sind bereits die kanonische Ereignissprache — ein Realtime-Layer abonniert sie, erfindet
  keine neuen.
- **Namensraum nach außen:** identisch zu den internen Events (`knowledge.article.published`),
  gefiltert auf empfängerrelevante + berechtigungsgeprüfte Ereignisse.
- **Transport-Entscheidung (wenn aktiviert):** zuerst **SSE** (`GET /events/stream`,
  Server-Sent Events) — einfacher als WebSocket (kein Upgrade-Handling am Proxy, automatisches
  Reconnect, reicht für Notify-Use-Cases). WebSocket erst bei bidirektionalem Bedarf
  (Kollaborations-Editor, nach 1.0). Diese Wahl wird bei Aktivierung als ADR festgeschrieben.
- **Skalierung:** SSE-Fan-out über Redis Pub/Sub (`events:user:<id>`), damit Multi-Replica-
  Backends konsistent bleiben; Sticky Sessions sind nicht nötig.
- **AuthZ:** Stream-Subscribe nutzt die normale Session; jedes Ereignis wird beim Publizieren
  gegen den Empfänger geprüft (kein „Broadcast + Client filtert").

## 3. Ausgehende Webhooks (Phase 3)

Fachlich bei Notification (FR-NOTI-007, Regeln N-7): Admin-konfigurierte Endpunkte abonnieren
Ereignistypen; Zustellung als signierter POST:

```
POST <url>
X-Webhook-Event: knowledge.article.published
X-Webhook-Delivery: uuid
X-Signature: sha256=<HMAC über Rohbody>
{ "event": "knowledge.article.published", "occurredAt": "…", "data": { …IDs, Titel, URLs… } }
```

Payloads enthalten Referenzen + Kurzfakten, nie vollständige Inhalte oder PII über das
Nötige hinaus. Retry: 5 Versuche exponentiell; Auto-Disable nach 10 Fehlschlägen in Folge.

## 4. Verbote bis zur Aktivierung

- Kein Feature darf Realtime **voraussetzen** — Polling-Fallback ist Pflicht-Design in 1.x.
- Keine Client-Bibliotheken/Abstraktionen „auf Vorrat" im Frontend — der API-Client erhält den
  SSE-Layer erst mit dem Aktivierungs-ADR.
