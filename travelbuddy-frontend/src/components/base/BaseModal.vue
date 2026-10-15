<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmação' },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const dialog = ref(null)
function close() { if (!props.busy) emit('update:modelValue', false) }
function onKeydown(event) { if (event.key === 'Escape') close() }
watch(() => props.modelValue, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.body.classList.add('modal-open')
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.classList.remove('modal-open')
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop-custom" @click.self="close">
      <section ref="dialog" class="confirmation-modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="d-flex align-items-center justify-content-between mb-3">
          <h2 class="h5 mb-0">{{ title }}</h2>
          <button type="button" class="btn-close" aria-label="Fechar" :disabled="busy" @click="close" />
        </header>
        <div class="mb-4"><slot /></div>
        <footer class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" :disabled="busy" @click="close">Cancelar</button>
          <button type="button" class="btn btn-danger" :disabled="busy" @click="emit('confirm')">{{ busy ? 'Excluindo...' : 'Excluir destino' }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
