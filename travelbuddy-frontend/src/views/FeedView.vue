<script setup>
import { ref, onMounted } from 'vue'
import { getFeed } from '../services/destinationService'
import DestinationCard from '../components/DestinationCard.vue'
import BaseButton from '../components/base/BaseButton.vue'

const LIMIT = 12

const destinations = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)
const errorMessage = ref('')

async function loadPage() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getFeed(page.value, LIMIT)
    const items = response.data

    destinations.value.push(...items)
    hasMore.value = items.length === LIMIT
    page.value += 1
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-4">Feed</h2>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <p v-if="!loading && !errorMessage && destinations.length === 0" class="text-muted">
      Nenhum destino publicado ainda.
    </p>

    <div class="row g-3">
      <div v-for="destination in destinations" :key="destination.id" class="col-12 col-sm-6 col-lg-4">
        <DestinationCard :destination="destination" />
      </div>
    </div>

    <div class="text-center mt-4">
      <p v-if="loading" class="text-muted">Carregando...</p>
      <BaseButton v-else-if="hasMore && destinations.length > 0" @click="loadPage">
        Carregar mais
      </BaseButton>
    </div>
  </div>
</template>