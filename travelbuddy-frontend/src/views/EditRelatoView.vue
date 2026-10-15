<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDestinationForEdit, updateDestination } from '../services/destinationService'
import { getDestinationImageUrl, getLocalPreviewUrl } from '../utils/media'
import BaseButton from '../components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const categories = ['praia', 'montanha', 'cidade', 'campo', 'outro']
const form = ref({ title: '', description: '', category: '' })
const currentImage = ref('')
const file = ref(null)
const preview = ref('')
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const fieldError = ref('')
const imageUrl = computed(() => preview.value || (currentImage.value ? getDestinationImageUrl(currentImage.value) : ''))
onMounted(async () => {
  try {
    const { data } = await getDestinationForEdit(route.params.id)
    form.value = { title: data.title, description: data.description || '', category: data.category }
    currentImage.value = data.image
  } catch (error) { errorMessage.value = error.message }
  finally { loading.value = false }
})
function onFileChange(event) {
  file.value = event.target.files?.[0] || null
  preview.value = file.value ? getLocalPreviewUrl(file.value) : ''
}
async function submit() {
  errorMessage.value = ''
  fieldError.value = ''
  if (!form.value.title.trim()) { fieldError.value = 'O título é obrigatório.'; return }
  saving.value = true
  const data = new FormData()
  data.append('title', form.value.title)
  data.append('description', form.value.description)
  data.append('category', form.value.category)
  if (file.value) data.append('image', file.value)
  try {
    const response = await updateDestination(route.params.id, data)
    await router.push({ name: 'relato-detail', params: { id: response.data.id }, query: { atualizado: '1' } })
  } catch (error) { errorMessage.value = error.message }
  finally { saving.value = false }
}
</script>

<template>
  <section class="container py-4 page-shell">
    <div v-if="loading" class="empty-state">Carregando destino...</div>
    <div v-else-if="errorMessage && !currentImage" class="alert alert-danger">{{ errorMessage }} <RouterLink :to="{ name: 'feed' }">Voltar</RouterLink></div>
    <form v-else class="editor-card" @submit.prevent="submit">
      <p class="eyebrow">SUA PUBLICAÇÃO</p><h1>Editar destino</h1><p class="text-muted mb-4">Atualize os detalhes ou escolha outra imagem.</p>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <label class="form-label" for="destination-title">Título</label>
      <input id="destination-title" v-model="form.title" maxlength="100" class="form-control mb-1" :class="{ 'is-invalid': fieldError }" />
      <div v-if="fieldError" class="invalid-feedback d-block mb-3">{{ fieldError }}</div>
      <label class="form-label mt-3" for="destination-description">Descrição</label>
      <textarea id="destination-description" v-model="form.description" maxlength="500" rows="4" class="form-control" />
      <label class="form-label mt-3" for="destination-category">Categoria</label>
      <select id="destination-category" v-model="form.category" class="form-select">
        <option v-for="category in categories" :key="category" :value="category">{{ category[0].toUpperCase() + category.slice(1) }}</option>
      </select>
      <label class="form-label mt-3" for="destination-image">Imagem <span class="text-muted fw-normal">(opcional)</span></label>
      <input id="destination-image" type="file" class="form-control" accept="image/jpeg,image/png,image/webp" @change="onFileChange" />
      <img v-if="imageUrl" :src="imageUrl" alt="Prévia do destino" class="edit-image-preview mt-3" />
      <div class="d-flex gap-2 mt-4">
        <BaseButton :loading="saving" loading-text="Salvando...">Salvar alterações</BaseButton>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'relato-detail', params: { id: route.params.id } }">Cancelar</RouterLink>
      </div>
    </form>
  </section>
</template>
