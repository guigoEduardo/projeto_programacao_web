<script setup>
import { ref, onMounted } from 'vue'
import { getMyProfile, updateProfile } from '../../services/authService'
import { useAuthStore } from '../../stores/auth'
import { getProfilePictureUrl, getLocalPreviewUrl } from '../../utils/media'

const authStore = useAuthStore()

const BIO_MAX = 255

const fullName = ref('')
const bio = ref('')
const profilePicture = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const bioError = ref('')

onMounted(async () => {
  try {
    const response = await getMyProfile()
    fullName.value = response.data.fullName
    bio.value = response.data.bio || ''
    profilePicture.value = response.data.profilePicture
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = getLocalPreviewUrl(file)
}

function validate() {
  bioError.value = ''
  errorMessage.value = ''

  if (!fullName.value.trim()) {
    errorMessage.value = 'O nome completo não pode ficar vazio.'
    return false
  }
  if (bio.value.length > BIO_MAX) {
    bioError.value = `A bio deve ter no máximo ${BIO_MAX} caracteres.`
    return false
  }
  return true
}

async function handleSubmit() {
  successMessage.value = ''
  if (!validate()) return

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('fullName', fullName.value)
    formData.append('bio', bio.value)
    if (selectedFile.value) {
      formData.append('profilePicture', selectedFile.value)
    }

    const response = await updateProfile(formData)
    profilePicture.value = response.data.profilePicture
    selectedFile.value = null
    previewUrl.value = null
    successMessage.value = 'Perfil atualizado com sucesso.'

    if (authStore.user) {
      authStore.user.fullName = response.data.fullName
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4" style="max-width: 480px;">
    <h1 class="mb-4">Meu Perfil</h1>

    <div v-if="loading">Carregando...</div>

    <form v-else @submit.prevent="handleSubmit">
      <div class="mb-3 text-center">
        <img
          :src="previewUrl || getProfilePictureUrl(profilePicture)"
          alt="Foto de perfil"
          class="rounded-circle"
          style="width: 120px; height: 120px; object-fit: cover;"
        />
        <div class="mt-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="form-control"
            @change="handleFileChange"
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Nome completo</label>
        <input v-model="fullName" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Bio</label>
        <textarea v-model="bio" class="form-control" rows="3"></textarea>
        <small class="text-muted">{{ bio.length }}/{{ BIO_MAX }}</small>
        <div v-if="bioError" class="text-danger small">{{ bioError }}</div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>
    </form>
  </div>
</template>