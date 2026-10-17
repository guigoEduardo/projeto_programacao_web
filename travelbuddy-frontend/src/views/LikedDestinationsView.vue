<script setup>
import { ref, onMounted } from 'vue'
import DestinationCard from '../components/DestinationCard.vue'
import { getLikedDestinations } from '../services/likeService'

const destinations = ref([])
const loading = ref(true)
const errorMessage = ref('')
onMounted(async () => {
  try { destinations.value = (await getLikedDestinations()).data }
  catch (error) { errorMessage.value = error.message || 'Não foi possível carregar seus destinos curtidos.' }
  finally { loading.value = false }
})
</script>

<template>
  <section class="container py-4 page-shell">
    <header class="section-heading"><div><p class="eyebrow">SUA COLEÇÃO</p><h1>Destinos curtidos</h1></div><span class="count-pill">{{ destinations.length }}</span></header>
    <p v-if="loading" class="text-muted">Carregando destinos...</p>
    <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-else-if="!destinations.length" class="empty-state"><i class="bi bi-heart" /><h2>Nenhum destino curtido ainda</h2><p>Explore o feed e salve os lugares que inspiram você.</p><RouterLink class="btn btn-primary" :to="{ name: 'feed' }">Explorar destinos</RouterLink></div>
    <div v-else class="row g-4"><div v-for="destination in destinations" :key="destination.id" class="col-12 col-sm-6 col-xl-4"><DestinationCard :destination="destination" /></div></div>
  </section>
</template>
