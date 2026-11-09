<script setup>
import { onMounted } from 'vue'
import { getFeed } from '../services/destinationService'
import DestinationCard from '../components/DestinationCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { usePaginatedList } from '../composables/usePaginatedList'
import { PAGINATION } from '../config/constants'

const { items: destinations, hasMore, loading, errorMessage, loadMore } = usePaginatedList(getFeed, { limit: PAGINATION.DEFAULT_LIMIT })
onMounted(loadMore)
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-4">Feed</h2>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }} <button class="btn btn-outline-danger btn-sm" :disabled="loading" @click="loadMore">Tentar novamente</button></div>

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
      <BaseButton v-else-if="hasMore && destinations.length > 0" @click="loadMore">
        Carregar mais
      </BaseButton>
    </div>
  </div>
</template>
