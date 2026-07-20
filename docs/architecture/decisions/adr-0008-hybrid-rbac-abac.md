# ADR-0008: Hybrides Autorisierungsmodell RBAC + ABAC

**Status:** Akzeptiert · **Datum:** 2026-07-20

## Kontext

Die Rechteanforderungen spannen sich von einfachen Community-Setups („Maintainer dieses Space")
bis zu Enterprise-Governance („Publizieren nur mit MFA und nur Mitglieder der Abteilung X").
Das Fachkonzept (§7) fordert ein hybrides System aus Rollen, Gruppen, Attributen und Policies;
Rechte müssen auf Geltungsbereiche (Space, Organisation, Sprache) einschränkbar sein.

## Entscheidung

Zweistufiges Modell im Modul `authorization`:

1. **RBAC als Fundament:** Permissions (`<modul>.<ressource>.<aktion>`) → Rollen → Zuweisung an
   Nutzer **oder Gruppen** mit Scope (`global` | `organization` | `space` | `language`).
   Systemrollen sind mitgeliefert und geschützt (FR-AUTZ-006).
2. **ABAC als Verfeinerung:** Policies mit Bedingungen über Subjekt-, Ressourcen- und
   Kontextattribute, Effekt `allow`/`deny`, Priorität. Evaluationsreihenfolge:
   `explicit deny (Policy) > allow (Policy) > allow (RBAC) > deny (Default)`.

Eine zentrale `AccessDecisionService.can(actor, permission, resource?)`-API ist der **einzige**
Entscheidungspunkt; Guards, Services und Suche nutzen sie
(→ [security/03](../../security/03-authorization-enforcement.md)).

## Betrachtete Alternativen

- **Nur RBAC** — abgelehnt: Enterprise-Bedingungen (MFA-Pflicht, Attributsregeln) nicht abbildbar.
- **Nur ABAC / Policy-Engine überall** — abgelehnt: für 90 % der Fälle (Community-Rollen)
  unnötig komplex, schwer erklärbar, Performance-Risiko.
- **Externe Engine (OPA, Casbin, SpiceDB)** — abgelehnt für 1.0: zusätzlicher Dienst bzw.
  Fremd-DSL widerspricht Self-Hosting-Einfachheit; die Policy-Bedingungssprache bleibt bewusst
  klein (JSON-Conditions, → [services/authorization](../../services/authorization-service.md)).

## Konsequenzen

- ✅ Community-Setups nutzen nur Rollen; Enterprise aktiviert Policies — gleiche Codebasis
  (ADR-0009).
- ✅ Ein Entscheidungspunkt macht Audit („warum durfte X?") und die Berechtigungsauskunft
  (FR-AUTZ-010) möglich.
- ⚠️ Entscheidungscaching (Redis, TTL 60 s) nötig; Invalidierung bei Zuweisungs-/Policy-Änderung
  ist Pflicht (→ [04-backend-architecture.md §8](../04-backend-architecture.md)).
- ⚠️ Die Bedingungssprache der Policies ist versioniert; Erweiterungen brauchen Schema-Migration
  + Doku.
