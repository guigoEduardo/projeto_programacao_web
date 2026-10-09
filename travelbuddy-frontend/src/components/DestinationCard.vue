<script setup>
import { computed } from 'vue'
import { getDestinationImageUrl } from '../utils/media'

const props = defineProps({
  destination: { type: Object, required: true }
})

const imageUrl = computed(() => getDestinationImageUrl(props.destination.image))
const authorName = computed(() => props.destination.User?.username ?? 'Desconhecido')
</script>

<template>
  <router-link
    :to="{ name: 'relato-detail', params: { id: destination.id } }"
    class="text-decoration-none text-reset"
  >
    <div class="card destination-card h-100">
      <img
        :src="imageUrl"
        :alt="destination.title"
        class="destination-card-img"
        loading="lazy"
      />
      <div class="card-body">
        <span class="badge bg-success mb-2">{{ destination.category }}</span>
        <h5 class="card-title mb-1">{{ destination.title }}</h5>
        <p class="card-text text-muted small mb-0">por {{ authorName }}</p>
      </div>
    </div>
  </router-link>
</template>