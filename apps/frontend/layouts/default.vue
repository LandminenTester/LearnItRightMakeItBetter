<script setup lang="ts">
// LirPublicShell-Vorstufe — vollständige Shell folgt mit E-14
// (docs/design-system/04-layouts-and-patterns.md §1).
const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-surface focus:p-2"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <header class="border-b border-border-default bg-surface">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span class="font-semibold">{{ t('app.name') }}</span>
        <span class="text-sm text-muted">{{ t('app.claim') }}</span>
      </div>
    </header>
    <main id="main" class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>
    <footer class="border-t border-border-default bg-surface">
      <div class="mx-auto max-w-5xl px-4 py-4 text-sm text-muted">
        {{ t('app.footerLicense') }}
      </div>
    </footer>
  </div>
</template>
