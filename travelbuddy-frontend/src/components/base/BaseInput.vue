<script setup>
const model = defineModel()

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  rows: { type: Number, default: null },
  maxlength: { type: Number, default: null },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <textarea
      v-if="rows"
      :id="id"
      v-model="model"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :rows="rows"
      :maxlength="maxlength"
    ></textarea>
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
    />
    <div v-if="hint" class="form-text text-muted">{{ hint }}</div>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>