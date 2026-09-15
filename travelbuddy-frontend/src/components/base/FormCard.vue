<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-sm p-4" style="width: 100%; max-width: 400px;">
      <h1 class="h4 mb-4 text-center text-brand">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>