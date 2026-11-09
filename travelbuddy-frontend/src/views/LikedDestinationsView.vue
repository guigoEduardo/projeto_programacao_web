<script setup>
import { onMounted } from 'vue'
import DestinationCard from '../components/DestinationCard.vue'
import { getLikedDestinations } from '../services/likeService'
import { useAsyncData } from '../composables/useAsyncData'

const { data: destinations, loading, errorMessage, execute } = useAsyncData(getLikedDestinations, { immediate: false, initialValue: [] })
onMounted(() => execute().catch(() => {}))
</script>

<template>
  <section class="container py-4 page-shell">
    <header class="section-heading"><div><p class="eyebrow">SUA COLEÇÃO</p><h1>Destinos curtidos</h1></div><span class="count-pill">{{ destinations.length }}</span></header>
    <p v-if="loading" class="text-muted">Carregando destinos...</p>
    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }} <button class="btn btn-outline-danger btn-sm" @click="execute().catch(() => {})">Tentar novamente</button></div>
    <div v-else-if="!destinations.length" class="empty-state"><i class="bi bi-heart" /><h2>Nenhum destino curtido ainda</h2><p>Explore o feed e salve os lugares que inspiram você.</p><RouterLink class="btn btn-primary" :to="{ name: 'feed' }">Explorar destinos</RouterLink></div>
    <div v-else class="row g-4"><div v-for="destination in destinations" :key="destination.id" class="col-12 col-sm-6 col-xl-4"><DestinationCard :destination="destination" /></div></div>
  </section>
</template>
