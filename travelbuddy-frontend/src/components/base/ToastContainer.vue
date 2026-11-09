<script setup>
import { useToast } from '../../composables/useToast'
const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <section class="toast-container" aria-label="Notificações" aria-live="polite">
      <article v-for="toast in toasts" :key="toast.id" class="app-toast" :class="`app-toast--${toast.type}`" role="status">
        <span>{{ toast.message }}</span>
        <button type="button" class="btn-close" aria-label="Fechar notificação" @click="dismiss(toast.id)" />
      </article>
    </section>
  </Teleport>
</template>
