<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDestinationById } from '../services/destinationService'
import { getDestinationImageUrl, getProfilePictureUrl } from '../utils/media'

const route = useRoute()

const destination = ref(null)
const isOwner = ref(false)
const loading = ref(true)
const errorMessage = ref('')

const imageUrl = computed(() =>
  destination.value ? getDestinationImageUrl(destination.value.image) : ''
)

const author = computed(() => destination.value?.User ?? null)

const createdAtLabel = computed(() =>
  destination.value
    ? new Date(destination.value.createdAt).toLocaleDateString('pt-BR')
    : ''
)

onMounted(async () => {
  try {
    const response = await getDestinationById(route.params.id)
    destination.value = response.data.destination
    isOwner.value = response.data.isOwner
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container py-4">
    <p v-if="loading" class="text-muted">Carregando...</p>

    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
      <router-link :to="{ name: 'feed' }" class="alert-link ms-2">Voltar ao feed</router-link>
    </div>

    <div v-else-if="destination" class="card">
      <img :src="imageUrl" :alt="destination.title" class="destination-detail-img" />

      <div class="card-body">
        <span class="badge bg-success mb-2">{{ destination.category }}</span>
        <h2 class="card-title">{{ destination.title }}</h2>
        <p v-if="destination.description" class="card-text">{{ destination.description }}</p>

        <div class="d-flex align-items-center gap-2 mt-3">
          <img
            v-if="author"
            :src="getProfilePictureUrl(author.profilePicture)"
            :alt="author.username"
            class="rounded-circle"
            width="32"
            height="32"
          />
          <span class="text-muted small">
            por {{ author ? author.username : 'Desconhecido' }} em {{ createdAtLabel }}
            · {{ destination.viewsCount }} visualizações
          </span>
        </div>
      </div>
    </div>
  </div>
</template>