<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/authService'
import { getFollowers, getFollowing } from '../../services/followService'
import { getProfilePictureUrl } from '../../utils/media'

const props = defineProps({ kind: { type: String, required: true } })
const route = useRoute()
const profile = ref(null)
const people = ref([])
const loading = ref(true)
const errorMessage = ref('')
let requestId = 0
async function loadList() {
  const currentRequest = ++requestId
  const kind = props.kind
  loading.value = true
  errorMessage.value = ''
  profile.value = null
  people.value = []
  try {
    const response = await getPublicProfile(route.params.username)
    if (currentRequest !== requestId) return
    profile.value = response.data
    const list = await (kind === 'followers' ? getFollowers : getFollowing)(response.data.id)
    if (currentRequest === requestId) people.value = list.data
  } catch (error) {
    if (currentRequest === requestId) errorMessage.value = error.message
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
watch(() => [props.kind, route.params.username], loadList, { immediate: true })
</script>

<template>
  <section class="container py-4 page-shell">
    <RouterLink :to="{ name: 'public-profile', params: { username: route.params.username } }" class="btn btn-outline-success mb-3">Voltar ao perfil</RouterLink>
    <h1 class="h2">{{ props.kind === 'followers' ? 'Seguidores' : 'Seguindo' }} de @{{ route.params.username }}</h1>
    <nav class="nav nav-tabs my-4" aria-label="Relações do perfil">
      <RouterLink class="nav-link" :class="{ active: props.kind === 'followers' }" :aria-current="props.kind === 'followers' ? 'page' : undefined" :to="{ name: 'profile-followers', params: { username: route.params.username } }">Seguidores</RouterLink>
      <RouterLink class="nav-link" :class="{ active: props.kind === 'following' }" :aria-current="props.kind === 'following' ? 'page' : undefined" :to="{ name: 'profile-following', params: { username: route.params.username } }">Seguindo</RouterLink>
    </nav>
    <p v-if="loading" role="status">Carregando pessoas...</p>
    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }} <button class="btn btn-outline-danger btn-sm" @click="loadList">Tentar novamente</button></div>
    <div v-else-if="!people.length" class="empty-state compact">
      <i class="bi bi-people" aria-hidden="true" />
      <p>{{ props.kind === 'followers' ? `@${profile.username} ainda não tem seguidores.` : `@${profile.username} ainda não segue ninguém.` }}</p>
    </div>
    <ul v-else class="list-group">
      <li v-for="person in people" :key="person.id" class="list-group-item">
        <RouterLink class="d-flex align-items-center gap-3 py-2 text-decoration-none" :to="{ name: 'public-profile', params: { username: person.username } }">
          <img :src="getProfilePictureUrl(person.profilePicture)" alt="" class="rounded-circle" width="56" height="56" style="object-fit: cover" />
          <div><strong>{{ person.fullName || person.username }}</strong><div class="text-muted">@{{ person.username }}</div><p v-if="person.bio" class="small text-muted mb-0">{{ person.bio }}</p></div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
