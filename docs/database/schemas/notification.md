# Schema · notification

**Spezifikation:** [services/notification-service.md](../../services/notification-service.md) ·
**Landkarte:** [architecture/modules/notification.md](../../architecture/modules/notification.md)

## notifications

| Spalte | Typ | Constraints | Beschreibung |
|---|---|---|---|
| id | uuid | PK | |
| userId | uuid | FK→users Cascade | Empfänger |
| type | String | NOT NULL | Katalog-Key (`review.requested`, …) |
| payload | Json | NOT NULL | IDs, Titel, Ziel-Link, Zähler (Dedup N-3) |
| dedupeKey | String? | | (`type`, Ressource, Empfänger) je Stunde |
| readAt | DateTime? | | |

Indizes: (`userId`, `readAt`), (`userId`, `createdAt`), `dedupeKey`. TTL-Job: 90 Tage.

## notification_preferences

(`userId` FK Cascade, `type` String, `channel` Enum `in_app`\|`email`) PK · `enabled` Boolean.
Fehlender Eintrag = Katalog-Default; Security-/System-Typen ignorieren Einträge (N-2).

## watches

(`userId` FK Cascade, `resourceType` Enum `space`\|`article`, `resourceId` uuid) PK ·
Index (`resourceType`, `resourceId`) für Fan-out.

## email_logs (Diagnose, 30 Tage Rotation)

`id` uuid PK · `recipientHash` String (Datenschutz) · `type` String ·
`status` Enum (`queued`\|`sent`\|`failed`\|`dead`) · `attempts` Int · `lastError` String? ·
`sentAt` DateTime? · Index (`status`, `createdAt`).

## webhook_endpoints (Phase 3, FR-NOTI-007)

`id` uuid PK · `url` String (validiert: kein privates Netz, N-7) · `secretEnc` Bytes
(HMAC-Secret verschlüsselt) · `events` String[] · `enabled` Boolean · `failureCount` Int
(Auto-Disable bei 10) · `lastDeliveryAt` / `lastFailureAt` DateTime? · `createdById` FK→users.
