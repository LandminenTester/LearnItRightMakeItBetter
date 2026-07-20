# E-03 · User Stories

**Epic:** [README.md](README.md) · Fachregeln: [authorization-service.md](../../../services/authorization-service.md)

## US-03-01 · Space-Rollen vergeben (P2 Mira / P5 Deniz) — FR-AUTZ-001, 003 · Must · Phase 1

> Als Space-Verantwortliche möchte ich Mitgliedern Rollen in genau meinem Space geben, damit
> Rechte dort enden, wo meine Verantwortung endet.

1. **Gegeben** die Systemrolle `space.maintainer` im Scope „Space Backend-Basics", **wenn** ich
   sie einem Mitglied zuweise, **dann** kann es genau dort Artikel verwalten und publizieren —
   in keinem anderen Space.
2. **Gegeben** eine Zuweisung, **wenn** ich sie entferne, **dann** verliert die Person die
   Rechte spätestens nach Cache-TTL (60 s), bei aktiver Sitzung ohne Neuanmeldung.
3. **Gegeben** fehlende eigene `assignment.assign`-Permission im Scope, **dann** sehe ich die
   Vergabe-UI nicht und die API verweigert (Deny-by-default).

## US-03-02 · Gruppen als Rechteträger (P6 Claire) — FR-AUTZ-004 · Must · Phase 2

1. **Gegeben** Gruppe „Backend Developer Group" mit Rolle „Backend Domain Contributor"
   (Scope: Space Backend), **wenn** ein Nutzer der Gruppe beitritt, **dann** erhält er die
   effektiven Permissions ohne weitere Aktion; beim Verlassen verliert er sie.
2. **Gegeben** ein Nutzer in mehreren Gruppen, **dann** vereinigen sich die Rechte (Union);
   Deny-Policies stechen weiterhin.

## US-03-03 · Custom-Rolle bauen (P6 Claire) — FR-AUTZ-006, 007, 009 · Must · Phase 2

1. **Gegeben** der Permission-Editor, **wenn** ich eine Rolle „Doku-Kurator" mit
   `knowledge.article.update` + `knowledge.review.review` (Scope space) erstelle, **dann** ist
   sie zuweisbar wie eine Systemrolle.
2. **Gegeben** eine Systemrolle, **wenn** ich Kern-Permissions entfernen will, **dann**
   verhindert dies das System mit Begründung (A-3); Ergänzungen sind erlaubt.
3. **Gegeben** eine Rolle in Verwendung, **wenn** ich sie lösche, **dann** verlangt das System
   die Bestätigung mit Anzeige der betroffenen Zuweisungen.

## US-03-04 · ABAC-Policy (P6 Claire) — FR-AUTZ-005 · Must · Phase 3

1. **Gegeben** Deny-Policy „ohne MFA kein `knowledge.article.publish`", **wenn** ein Nutzer ohne
   `mfaVerified` publizieren will, **dann** wird trotz Rolle verweigert; die Fehlermeldung nennt
   die Policy als Grund.
2. **Gegeben** zwei widersprechende Policies, **dann** gewinnt `deny`; bei gleichem Effekt
   entscheidet `priority` (A-5).
3. **Gegeben** eine deaktivierte Policy, **dann** hat sie keinerlei Wirkung, bleibt aber
   editierbar erhalten.

## US-03-05 · Effektive Rechte auskunftsfähig (P6 Claire) — FR-AUTZ-010 · Should · Phase 3

1. **Gegeben** die Berechtigungsauskunft eines Nutzers, **wenn** ich sie öffne, **dann** sehe
   ich jede effektive Permission mit Herkunft (direkte Rolle / Gruppe X / Policy Y) und Scope.
2. **Gegeben** die Frage „warum darf A das?", **wenn** ich die Detailansicht einer Permission
   öffne, **dann** zeigt sie den Entscheidungsweg gemäß Evaluationsreihenfolge.

## US-03-06 · Keine Selbst-Eskalation (alle) — Regel A-10 · Must · Phase 1

1. **Gegeben** ich besitze `authorization.assignment.assign` im Space-Scope, **wenn** ich mir
   selbst `platform.admin` zuweisen will, **dann** wird dies abgelehnt und auditiert.
2. **Gegeben** die letzte aktive `platform.admin`-Zuweisung, **wenn** jemand sie entfernen will,
   **dann** verweigert das System (Aussperr-Schutz A-3).
