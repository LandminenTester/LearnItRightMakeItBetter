# Component Library

**Status:** Verbindlich · **Version:** 1.0 · **Stand:** 2026-07-20

## 1. Konventionen

- **Namenspräfix `Lir`** (`LirButton`, `LirModal`) — verhindert Kollisionen, macht
  Design-System-Nutzung im Code sichtbar (und lintbar: Nicht-`Lir`-Basiskomponenten in
  `apps/frontend` → Fehler).
- `<script setup lang="ts">`, Props via `defineProps` mit exportierten TS-Interfaces
  (`LirButtonProps`); Events typisiert (`defineEmits`); Slots dokumentiert.
- **Varianten-API einheitlich:** `variant` (semantische Ausprägung), `size` (`sm|md|lg`),
  boolesche Modifier (`disabled`, `loading`, `block`) — keine Freitext-Klassen-Props.
- Styling ausschließlich Token-basierte Tailwind-Klassen im Komponenten-Template; keine
  Scoped-CSS-Blöcke außer für nicht-utility-fähige Details (dokumentiert).
- Jede Komponente: Histoire-Story (alle Varianten × beide Themes), Vitest-Komponententest
  (Verhalten + axe), Props-/Slot-/Event-Doku, Do/Don't.

## 2. Katalog

**Einzelspezifikationen** der wichtigsten Komponenten im Themenordner
[components/](components/README.md). Vollkatalog nach Kategorie (Phase = Entstehung):

| Kategorie | Komponenten | Phase |
|---|---|---|
| **Aktionen** | [LirButton](components/button.md), LirIconButton, LirButtonGroup, LirDropdownMenu | 0 |
| **Formulare** | [LirInput, LirTextarea, LirSelect, LirCombobox, LirCheckbox, LirRadioGroup, LirSwitch, LirFormField](components/form-controls.md), LirTagInput, LirDatePicker | 0–1 |
| **Overlays** | [LirModal, LirConfirmDialog, LirDrawer, LirPopover, LirTooltip](components/modal-overlays.md) | 0–1 |
| **Daten** | [LirTable](components/table.md), LirDescriptionList, LirPagination (Cursor), LirCard, LirStat | 1 |
| **Feedback & Status** | [LirToast, LirAlert, LirBadge, LirEmptyState, LirSkeleton, LirProgress, LirSpinner](components/feedback.md) | 0–1 |
| **Navigation** | LirTabs, LirBreadcrumbs, LirSidebarNav, LirTopbar, LirCommandPalette (E-06), LirStepper (Wizard) | 1 |
| **Identität** | LirAvatar (+ Gruppen), LirUserRef (Avatar+Handle-Link), LirOrgRef | 1 |
| **Fachkomponenten** | [LirArticleViewer](components/article-viewer.md), [LirMarkdownEditor](components/markdown-editor.md), [LirDiffViewer](components/diff-viewer.md), [LirPermissionEditor](components/permission-editor.md), LirTranslationSideBySide (E-05), LirReviewPanel, LirNotificationList, LirAuditTable | 1–3 |

**Admin Panels** (Fachkonzept-Beispiel) sind Kompositionen aus Layouts + `LirTable` +
`LirFormField`-Patterns — kein eigener Komponententyp
(→ [04-layouts-and-patterns.md](04-layouts-and-patterns.md)).

## 3. Qualitätskriterien (Definition of Done je Komponente)

1. Props-API reviewt (einheitliche Varianten-API, keine Leaky Abstractions)
2. Beide Themes + alle interaktiven Zustände (hover/focus/active/disabled/loading/error)
3. Tastaturbedienung + ARIA gemäß [05-accessibility-i18n.md](05-accessibility-i18n.md)
   (axe-Test in CI)
4. Responsive-Verhalten definiert (inkl. Touch-Ziele ≥ 44 px)
5. i18n: keine hartcodierten Texte — beschriftbare Slots/Props; interne Texte (z. B.
   „Schließen") über DS-eigene Locale-Dateien
6. Histoire-Story + Doku + Tests im selben PR

## 4. Evolution

- Neue Komponente erst, wenn ein Muster ≥ 2× gebraucht wird oder eine Fachkomponente
  spezifiziert ist — sonst Komposition im Feature.
- Breaking Changes an Props-APIs: Deprecation-Phase (alte Prop mit Warnung) über einen
  Minor-Release; Migrationshinweis in der Story.
- Das Design System versioniert nicht separat (Monorepo-Gesamtrelease, ADR-0010) — Breaking
  Changes werden im selben PR in allen Nutzungen migriert.
