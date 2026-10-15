<script setup>
import { computed } from 'vue'
import { getDestinationImageUrl, getProfilePictureUrl } from '../utils/media'

const props = defineProps({ destination: { type: Object, required: true } })
const imageUrl = computed(() => getDestinationImageUrl(props.destination.image))
const author = computed(() => props.destination.User ?? props.destination.user ?? null)
</script>

<template>
  <article class="card destination-card h-100">
    <router-link :to="{ name: 'relato-detail', params: { id: destination.id } }" class="destination-card-media" :aria-label="`Ver ${destination.title}`">
      <img :src="imageUrl" :alt="destination.title" class="destination-card-img" loading="lazy" />
      <span class="badge destination-category">{{ destination.category }}</span>
    </router-link>
    <div class="card-body d-flex flex-column">
      <router-link :to="{ name: 'relato-detail', params: { id: destination.id } }" class="destination-title-link">
        <h2 class="h5 card-title mb-2">{{ destination.title }}</h2>
      </router-link>
      <p v-if="destination.description" class="card-text text-muted small destination-description">{{ destination.description }}</p>
      <div class="mt-auto d-flex align-items-center justify-content-between gap-2 pt-2">
        <router-link v-if="author" :to="{ name: 'public-profile', params: { username: author.username } }" class="destination-author" @click.stop>
          <img :src="getProfilePictureUrl(author.profilePicture)" :alt="''" class="rounded-circle" width="30" height="30" />
          <span>@{{ author.username }}</span>
        </router-link>
        <span v-else class="small text-muted">Autor desconhecido</span>
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
