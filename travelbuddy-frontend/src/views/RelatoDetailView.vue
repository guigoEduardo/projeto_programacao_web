<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDestinationById } from '../services/destinationService'
import { getDestinationImageUrl, getProfilePictureUrl } from '../utils/media'
import LikeButton from '../components/LikeButton.vue'
import CommentSection from '../components/CommentSection.vue'
import AddToCollectionModal from '../components/collection/AddToCollectionModal.vue'
import { useAuth } from '../composables/useAuth'
import { useAsyncData } from '../composables/useAsyncData'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const showCollections = ref(false)

const destination = ref(null)
const isOwner = ref(false)
const isLiked = ref(false)
const { loading, errorMessage, execute } = useAsyncData(async (id, signal) => {
  const response = await getDestinationById(id, signal)
  return response.data
}, { immediate: false })

const imageUrl = computed(() =>
  destination.value ? getDestinationImageUrl(destination.value.image) : ''
)

const author = computed(() => destination.value?.User ?? null)

const createdAtLabel = computed(() =>
  destination.value
    ? new Date(destination.value.createdAt).toLocaleDateString('pt-BR')
    : ''
)

function saveDestination() { if (!isAuthenticated.value) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return } showCollections.value = true }

async function editDestination() {
  await router.push({ name: 'relato-edit', params: { id: destination.value.id } })
}

watch(() => route.params.id, async id => {
  try {
    const response = await execute(id)
    destination.value = response.destination
    isOwner.value = response.isOwner
    isLiked.value = response.isLiked
  } catch {}
}, { immediate: true })
</script>

<template>
  <div class="container py-4">
    <p v-if="loading" class="text-muted">Carregando...</p>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
      <button class="btn btn-link" @click="execute(route.params.id).catch(() => {})">Tentar novamente</button>
      <router-link :to="{ name: 'feed' }" class="alert-link ms-2">Voltar ao feed</router-link>
    </div>

    <div v-else-if="destination" class="card">
      <img :src="imageUrl" :alt="destination.title" class="destination-detail-img" />

      <div class="card-body">
        <div v-if="isOwner" class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-sm btn-outline-success" @click="editDestination"><i class="bi bi-pencil me-1" />Editar</button>
        </div>
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
            por <RouterLink v-if="author" :to="{ name: 'public-profile', params: { username: author.username } }" class="text-decoration-none">{{ author.username }}</RouterLink><span v-else>Desconhecido</span> em {{ createdAtLabel }}
            · {{ destination.viewsCount }} visualizações
          </span>
        </div>
        <div class="detail-actions mt-3 d-flex gap-2 align-items-center"><LikeButton :destination-id="destination.id" v-model="isLiked" v-model:count="destination.likesCount" /><button type="button" class="btn btn-outline-success" @click="saveDestination"><i class="bi bi-bookmark-plus me-1"/>Salvar</button></div>
        <AddToCollectionModal v-if="showCollections" :open="showCollections" :destination-id="destination.id" @close="showCollections=false" />
        <CommentSection :destination-id="destination.id" v-model:count="destination.commentsCount" />
      </div>
    </div>
  </div>
</template>
