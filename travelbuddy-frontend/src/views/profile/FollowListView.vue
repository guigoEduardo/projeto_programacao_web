<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/authService'
import { getFollowers, getFollowing } from '../../services/followService'
import { getProfilePictureUrl } from '../../utils/media'
import { useAsyncData } from '../../composables/useAsyncData'

const props = defineProps({ kind: { type: String, required: true } })
const route = useRoute()
const { data: list, loading, errorMessage, execute } = useAsyncData(async (kind, username, signal) => {
  const profileResponse = await getPublicProfile(username, signal)
  const listResponse = await (kind === 'followers' ? getFollowers : getFollowing)(profileResponse.data.id, signal)
  return { profile: profileResponse.data, people: listResponse.data }
}, { immediate: false })
const profile = computed(() => list.value?.profile || null)
const people = computed(() => list.value?.people || [])
async function loadList() {
  try { await execute(props.kind, route.params.username) } catch {}
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
