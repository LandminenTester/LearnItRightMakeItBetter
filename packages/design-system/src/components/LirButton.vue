<script setup lang="ts">
// Referenzkomponente des Design Systems — Spezifikation:
// docs/design-system/components/button.md (API, Zustände, A11y, Do/Don't).
import { computed } from 'vue';

export interface LirButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<LirButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
});

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const variantClasses: Record<NonNullable<LirButtonProps['variant']>, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover border-transparent',
  secondary: 'bg-surface text-primary border-border-default hover:bg-state-hover',
  ghost: 'bg-transparent text-primary border-transparent hover:bg-state-hover',
  danger: 'bg-danger text-on-accent hover:opacity-90 border-transparent',
};

const sizeClasses: Record<NonNullable<LirButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md border font-medium',
  'transition-colors duration-150 select-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? 'w-full' : '',
  props.disabled || props.loading
    ? 'cursor-not-allowed bg-state-disabled-bg text-state-disabled-text hover:bg-state-disabled-bg'
    : 'cursor-pointer',
]);

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return;
  emit('click', event);
}
</script>

<template>
  <button
    :type="props.type"
    :class="classes"
    :aria-disabled="props.disabled || props.loading || undefined"
    :aria-busy="props.loading || undefined"
    :disabled="props.disabled"
    @click="onClick"
  >
    <span
      v-if="props.loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
