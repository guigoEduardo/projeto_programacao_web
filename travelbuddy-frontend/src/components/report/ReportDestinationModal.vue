<script setup>
import { ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { REPORT_REASONS } from '../../config/constants'
import { reportDestination } from '../../services/reportService'

const props = defineProps({ modelValue: { type: Boolean, default: false }, destinationId: { type: [Number, String], required: true } })
const emit = defineEmits(['update:modelValue', 'reported'])
const reason = ref('')
const validationMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const formId = 'report-destination-form'
async function submit() {
  validationMessage.value = ''; errorMessage.value = ''
  if (!reason.value) { validationMessage.value = 'Escolha um motivo para continuar.'; return }
  isSubmitting.value = true
  try { await reportDestination(props.destinationId, reason.value); emit('reported') }
  catch (error) { errorMessage.value = error.message || 'Não foi possível enviar a denúncia.' }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Denunciar destino" :busy="isSubmitting" confirm-label="Enviar denúncia" @update:model-value="emit('update:modelValue', $event)">
    <form :id="formId" novalidate @submit.prevent="submit">
      <fieldset :disabled="isSubmitting" class="border-0 p-0 m-0">
        <legend class="fs-6">Por que este destino deve ser revisado?</legend>
        <label v-for="option in REPORT_REASONS" :key="option.value" class="d-flex align-items-center gap-2 mb-2">
          <input v-model="reason" type="radio" name="report-reason" :value="option.value" />{{ option.label }}
        </label>
      </fieldset>
      <p v-if="validationMessage" class="text-danger small mt-2" role="alert">{{ validationMessage }}</p>
      <p v-if="errorMessage" class="text-danger small mt-2" role="alert">{{ errorMessage }}</p>
    </form>
    <template #footer>
      <button class="btn btn-outline-secondary" type="button" :disabled="isSubmitting" @click="emit('update:modelValue', false)">Cancelar</button>
      <button class="btn btn-danger" type="submit" :form="formId" :disabled="isSubmitting">{{ isSubmitting ? 'Enviando...' : 'Enviar denúncia' }}</button>
    </template>
  </BaseModal>
</template>
