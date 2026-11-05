<script setup>
// ADR-012: Sidebar > Seguindo; cards > perfil > seguir/listas; visitante > login > perfil.
import { ref, onMounted } from 'vue'
import { getFollowingDestinations } from '../services/followService'
import DestinationCard from '../components/DestinationCard.vue'
import BaseButton from '../components/base/BaseButton.vue'

const LIMIT = 12
const destinations = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)
const errorMessage = ref('')
async function loadPage() {
  if (loading.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await getFollowingDestinations(page.value, LIMIT)
    const existing = new Set(destinations.value.map(item => item.id))
    destinations.value.push(...data.filter(item => !existing.has(item.id)))
    hasMore.value = data.length === LIMIT
    page.value += 1
  } catch (error) { errorMessage.value = error.message }
  finally { loading.value = false }
}
onMounted(loadPage)
</script>

<template>
  <section class="container py-4 page-shell">
    <p class="eyebrow">SUA REDE DE VIAJANTES</p><h1 class="h2 mb-4">Destinos de quem eu sigo</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }} <button class="btn btn-outline-danger btn-sm" :disabled="loading" @click="loadPage">Tentar novamente</button></div>
    <div v-if="!loading && !errorMessage && !destinations.length" class="empty-state">
      <i class="bi bi-people" aria-hidden="true" /><h2 class="h4">Nenhum destino por aqui ainda</h2>
      <p>Siga outros viajantes para acompanhar suas publicações.</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'feed' }">Explorar o Feed</RouterLink>
    </div>
    <div class="row g-4"><div v-for="destination in destinations" :key="destination.id" class="col-12 col-sm-6 col-xl-4"><DestinationCard :destination="destination" /></div></div>
    <div class="text-center mt-4">
      <p v-if="loading" role="status">Carregando destinos...</p>
      <BaseButton v-else-if="hasMore && destinations.length && !errorMessage" @click="loadPage">Carregar mais</BaseButton>
    </div>
  </section>
</template>
