<template>
  <div class="container py-4" style="max-width: 600px;">
    <h2 class="mb-4">Novo Destino</h2>

    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div class="mb-3">
      <label class="form-label">Título *</label>
      <input v-model="form.title" type="text" class="form-control" maxlength="100" />
      <div v-if="fieldErrors.title" class="text-danger small">{{ fieldErrors.title }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Descrição</label>
      <textarea v-model="form.description" class="form-control" rows="3" maxlength="500"></textarea>
    </div>

    <div class="mb-3">
      <label class="form-label">Categoria *</label>
      <select v-model="form.category" class="form-select">
        <option value="">Selecione...</option>
        <option value="praia">Praia</option>
        <option value="montanha">Montanha</option>
        <option value="cidade">Cidade</option>
        <option value="campo">Campo</option>
        <option value="outro">Outro</option>
      </select>
      <div v-if="fieldErrors.category" class="text-danger small">{{ fieldErrors.category }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Imagem *</label>
      <input type="file" class="form-control" accept="image/jpeg,image/png,image/webp" @change="onFileChange" />
      <div v-if="fieldErrors.image" class="text-danger small">{{ fieldErrors.image }}</div>
      <div v-if="imagePreview" class="mt-2">
        <img :src="imagePreview" class="img-fluid rounded" style="max-height: 200px;" />
      </div>
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-3">
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          :style="{ width: uploadProgress + '%' }"
        >{{ uploadProgress }}%</div>
      </div>
    </div>

    <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
      {{ loading ? 'Enviando...' : 'Publicar Destino' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createDestination } from '../services/destinationService'

const form = ref({ title: '', description: '', category: '' })
const imageFile = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fieldErrors = ref({})

function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  fieldErrors.value = {}

  if (!form.value.title) { fieldErrors.value.title = 'O título é obrigatório.'; return }
  if (!form.value.category) { fieldErrors.value.category = 'A categoria é obrigatória.'; return }
  if (!imageFile.value) { fieldErrors.value.image = 'A imagem é obrigatória.'; return }

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('category', form.value.category)
  formData.append('image', imageFile.value)

  loading.value = true
  uploadProgress.value = 0

  try {
    await createDestination(formData, (progressEvent) => {
      uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    })
    successMessage.value = 'Destino publicado com sucesso!'
    form.value = { title: '', description: '', category: '' }
    imageFile.value = null
    imagePreview.value = null
    uploadProgress.value = 0
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Erro ao publicar destino.'
  } finally {
    loading.value = false
  }
}
</script>