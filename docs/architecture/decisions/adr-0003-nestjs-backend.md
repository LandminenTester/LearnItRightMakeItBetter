# ADR-0003: NestJS als Backend-Framework

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Der modulare Monolith (ADR-0001) braucht ein Framework mit erstklassigem Modulsystem,
Dependency Injection, Guard-/Interceptor-Pipeline für die Security-Anforderungen
(Deny-by-default, FR-AUTZ-008) und durchgehender TypeScript-Unterstützung (NFR-040).
Das Fachkonzept (§7) legt NestJS fest: Enterprise-Architektur, Module, Dependency Injection,
Security-Konzepte, TypeScript.

## Entscheidung

**NestJS** auf Node.js 22 LTS. Module bilden die 12 Fachmodule ab; Guards/Interceptors bilden
die Request-Pipeline (→ [04-backend-architecture.md](../04-backend-architecture.md));
`@nestjs/swagger` + Zod liefern die OpenAPI-Spec; `nest-commander` die CLI (Recovery, Reindex);
BullMQ-Integration über `@nestjs/bullmq`.

## Betrachtete Alternativen

- **Express/Fastify pur** — abgelehnt: Modul-/DI-Struktur müsste selbst gebaut werden; genau
  diese Struktur ist der Kern von ADR-0001.
- **AdonisJS** — abgelehnt: kleineres Ökosystem, weniger Enterprise-Verbreitung.
- **Go/Java-Backend** — abgelehnt: bricht die TypeScript-Durchgängigkeit
  (Shared Types zwischen Frontend/Backend, ein Sprach-Stack fürs Team).

## Konsequenzen

- ✅ DI erleichtert Tests (Ersetzen von Ports/Adaptern), Guards erzwingen AuthZ deklarativ.
- ✅ Fastify-Adapter unter NestJS für Performance nutzbar, ohne API-Code zu ändern.
- ⚠️ Decorator-/Reflection-Magie diszipliniert einsetzen: Fachlogik bleibt framework-frei in
  `domain/` (Regel-Schnitt → [04-backend-architecture.md §3](../04-backend-architecture.md)).
