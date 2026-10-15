<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/authService'
import { useAuth } from '../../composables/useAuth'
import { getProfilePictureUrl } from '../../utils/media'
import DestinationCard from '../../components/DestinationCard.vue'

const route = useRoute()
const { isAuthenticated, user } = useAuth()
const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const isOwnProfile = computed(() => Boolean(profile.value && user.value?.id === profile.value.id))
const items = computed(() => profile.value?.Destinations || profile.value?.destinations || [])
watch(() => route.params.username, async (username) => {
  loading.value = true
  profile.value = null
  errorMessage.value = ''
  try { profile.value = (await getPublicProfile(username)).data }
  catch (error) { errorMessage.value = error.message }
  finally { loading.value = false }
}, { immediate: true })
</script>

<template>
  <section class="container py-4 page-shell">
    <div v-if="loading" class="empty-state">Carregando perfil...</div>
    <div v-else-if="errorMessage" class="empty-state"><i class="bi bi-person-exclamation" /><h1>Perfil indisponível</h1><p>{{ errorMessage }}</p></div>
    <template v-else-if="profile">
      <header class="profile-hero card border-0 mb-4">
        <img :src="getProfilePictureUrl(profile.profilePicture)" :alt="`Foto de ${profile.username}`" class="profile-avatar" />
        <div class="flex-grow-1"><p class="eyebrow mb-1">PERFIL DE VIAJANTE</p><h1 class="h2 mb-1">{{ profile.fullName || profile.username }}</h1><p class="text-muted mb-2">@{{ profile.username }}</p><p v-if="profile.bio" class="mb-0">{{ profile.bio }}</p></div>
        <div class="profile-actions">
          <RouterLink v-if="isOwnProfile" class="btn btn-outline-success" :to="{ name: 'my-profile' }">Editar Perfil</RouterLink>
          <button v-else-if="isAuthenticated" class="btn btn-primary" type="button">Seguir</button>
        </div>
      </header>
      <div class="section-heading"><div><p class="eyebrow">ROTEIROS COMPARTILHADOS</p><h2>Destinos de {{ profile.username }}</h2></div><span class="count-pill">{{ items.length }} {{ items.length === 1 ? 'destino' : 'destinos' }}</span></div>
      <div v-if="items.length" class="row g-4">
        <div v-for="destination in items" :key="destination.id" class="col-12 col-sm-6 col-xl-4"><DestinationCard :destination="{ ...destination, User: { username: profile.username, profilePicture: profile.profilePicture } }" /></div>
      </div>
      <div v-else class="empty-state compact"><i class="bi bi-map" /><h3>Nenhum destino publicado ainda</h3></div>
    </template>
  </section>
</template>
