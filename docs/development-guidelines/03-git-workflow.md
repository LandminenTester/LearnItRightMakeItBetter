# Git-Workflow

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Branching — Trunk-based

- `main` ist immer releasefähig (alle Gates grün, Branch Protection
  [security/06 §4](../security/06-secure-development-pipeline.md)).
- Kurzlebige Feature-Branches (< 1 Woche): `feat/e04-article-diff`, `fix/identity-lockout`,
  `docs/adr-0013` — Präfix = Commit-Type, danach Epic-/Themenbezug.
- Keine Dauer-Branches (`develop` existiert nicht); große Vorhaben landen hinter
  Modul-Flags/Feature-Flags in kleinen PRs auf `main` (Roadmap-Regel 3).
- Release-Tags `v1.4.2` auf `main`; Hotfix = normaler PR + Patch-Tag.

## 2. Commits — Conventional Commits

```
<type>(<scope>): <beschreibung im imperativ, englisch, ≤ 72 zeichen>

[body: warum, nicht was — deutsch oder englisch]
[footer: BREAKING CHANGE: … / Refs: US-04-02, FR-KNOW-009]
```

- **Types:** `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `ci`, `security`.
- **Scope** = Modul/Paket: `knowledge`, `identity`, `design-system`, `deploy`, `docs`.
- Story-/FR-Referenzen im Footer verknüpfen Code mit diesem Requirements-Repo.
- Atomar committen (ein logischer Schritt); WIP-Commits vor dem PR aufräumen
  (`rebase -i` lokal erlaubt — nie auf geteilten Branches force-pushen, `--force-with-lease`
  nur auf eigenen PR-Branches).

## 3. Pull Requests

- Vorlage [templates/pr-template.md](templates/pr-template.md) ist Pflicht (inkl.
  Security-Checkliste bei einschlägigen Änderungen).
- Klein schneiden: Richtwert ≤ 400 geänderte Zeilen Fachcode (Doku/Tests/Generate zählen
  nicht) — größere PRs begründen oder splitten.
- **Review:** ≥ 1 Approval; Reviewer prüft gegen Spezifikation (verlinkte Stories/Regeln),
  Negativpfade, Checklisten — nicht nur Stil. Review-SLA: erster Blick ≤ 1 Arbeitstag.
- Autor merged selbst (Squash-Merge Standard; Merge-Commit für mehrteilige, sauber
  strukturierte Historien). Squash-Message folgt Commit-Konvention.
- CI rot = kein Review-Anspruch; „mal eben ohne Tests mergen" existiert nicht (auch nicht für
  Admins — Branch Protection gilt für alle).

## 4. Releases

- Versionierung **SemVer** der Plattform (ein Release für alle Pakete, ADR-0010):
  MAJOR = Breaking (API v-Sprung, Migrations-Sonderpfad), MINOR = Features, PATCH =
  Fixes/Security.
- Release-PR: Version-Bump + generiertes Changelog (aus Conventional Commits, kuratiert) +
  Release-Notes-Abschnitte „Sicherheitsrelevant" und „Migrationshinweise" (Pflicht, auch wenn
  leer — [Upgrade-Runbook §1](../deployment/runbooks/upgrade.md) verlässt sich darauf).
- Tag ⇒ CI baut/signiert Images, erzeugt SBOM, veröffentlicht OpenAPI-Artefakt
  ([testing/05 §1](../testing/05-quality-gates-performance.md)).
- Meilenstein-Releases (M1–M3) zusätzlich: Nachweise aus
  [testing/05 §5](../testing/05-quality-gates-performance.md).

## 5. Doku & ADRs im Fluss

Verhaltensändernde PRs aktualisieren betroffene Doku im selben PR
([04-documentation-standards.md](04-documentation-standards.md)); Architekturentscheidungen
brauchen den ADR **vor** dem Implementierungs-PR ([decisions/README](../architecture/decisions/README.md)).
