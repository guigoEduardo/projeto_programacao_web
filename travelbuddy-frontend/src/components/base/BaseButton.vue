<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Aguarde...' },
  type: { type: String, default: 'submit' },
  variant: { type: String, default: 'primary' },
})
</script>

<template>
  <button
    :type="type"
    class="btn w-100"
    :class="`btn-${variant}`"
    :disabled="loading"
  >
    <span v-if="loading">{{ loadingText }}</span>
    <slot v-else />
  </button>
</template>