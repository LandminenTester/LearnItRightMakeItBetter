<script setup lang="ts">
import { LirButton } from '@lir/design-system';

const { t } = useI18n();

useHead({ title: t('home.title') });
</script>

<template>
  <section class="flex flex-col items-start gap-4">
    <h1 class="text-3xl font-bold">{{ t('home.title') }}</h1>
    <p class="max-w-prose text-secondary">{{ t('home.intro') }}</p>
    <div class="flex gap-3">
      <LirButton variant="primary">{{ t('home.ctaPrimary') }}</LirButton>
      <LirButton variant="secondary">{{ t('home.ctaSecondary') }}</LirButton>
    </div>
    <p class="text-sm text-muted">{{ t('home.phaseNote') }}</p>
  </section>
</template>
