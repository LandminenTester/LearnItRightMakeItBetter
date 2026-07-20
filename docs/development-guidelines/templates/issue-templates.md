# Vorlagen · Issues

**Quelle für `.github/ISSUE_TEMPLATE/`** (YAML-Forms werden hieraus abgeleitet)

## 1. Bug-Report (`bug_report`)

```markdown
### Beschreibung
<!-- Was passiert, was wurde erwartet? -->

### Reproduktion
1. …
2. …

### Kontext
- Version/Commit: · Deployment: compose/k8s/dev · Browser (bei UI):
- Betroffenes Modul (Vermutung): identity / knowledge / …
- `requestId` aus der Fehlerantwort (falls vorhanden):

### Logs/Screenshots
<!-- Keine Secrets/PII einfügen! -->

### Schwere (Einschätzung)
- [ ] blockierend  - [ ] hoch  - [ ] normal  - [ ] kosmetisch
```

**Hinweis im Template:** Sicherheitslücken NICHT als Issue — Meldung gemäß `SECURITY.md`
([security/08 §2](../../security/08-incident-response-recovery.md)).

## 2. Feature / Story-Task (`feature_task`)

```markdown
### Ziel
<!-- Nutzerwert in einem Satz. -->

### Bezug
- Epic/Story: [E-XX / US-XX-XX](../../requirements/epics/README.md) — oder: „neu, Requirements-Änderung nötig"
- FRs: FR-XXXX-XXX

### Scope dieses Tasks
<!-- Teilschnitt, falls Story größer als ein PR. -->

### Akzeptanz
<!-- Verweis auf Story-AK genügt; Ergänzungen hier. -->

### Offene Fragen
```

Regel: Tasks ohne Requirements-Bezug erzeugen zuerst einen Requirements-PR (neue Story/FR) —
keine „Geisterfeatures" ([05-agentic-development.md §2](../05-agentic-development.md)).

## 3. ADR-Vorschlag (`adr_proposal`)

```markdown
### Entscheidungsbedarf
<!-- Welche Frage muss entschieden werden, warum jetzt? -->

### Betroffene Bereiche
<!-- Module, Infrastruktur, API … -->

### Optionen (Kurzform)
1. …
2. …

### Empfehlung + Begründung
<!-- Danach: ADR-PR nach Template architecture/decisions/README.md -->
```

## 4. Betriebsproblem einer Instanz (`ops_issue`)

```markdown
### Symptom + Zeitraum
### Topologie (Compose Single-Node / K8s) + Version
### Bereits geprüft (Runbook-Schritte)
<!-- Verweis: docs/deployment/runbooks/ -->
### Metriken/Log-Auszüge (bereinigt)
```
