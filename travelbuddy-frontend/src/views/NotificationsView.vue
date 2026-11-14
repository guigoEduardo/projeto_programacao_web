<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaginatedList } from '../composables/usePaginatedList'
import { useNotificationsStore } from '../stores/notifications'
import { getNotifications, markNotificationAsRead } from '../services/notificationService'
import { NOTIFICATION_TEXT } from '../config/constants'
import { runOptimistic } from '../utils/optimistic'
import { getProfilePictureUrl } from '../utils/media'
import { formatDate } from '../utils/format'

const router = useRouter()
const store = useNotificationsStore()
const { items, hasMore, loading, errorMessage, loadMore, reload } = usePaginatedList(getNotifications)
const busyIds = ref(new Set())
const notifications = computed(() => items.value)
onMounted(loadMore)

async function markRead(item) {
  if (item.isRead || busyIds.value.has(item.id)) return
  busyIds.value = new Set([...busyIds.value, item.id])
  try {
    await runOptimistic({
      apply() {
        item.isRead = true
        store.setUnreadCount(Math.max(0, store.unreadCount - 1))
        return () => { item.isRead = false; store.setUnreadCount(store.unreadCount + 1) }
      },
      request: () => markNotificationAsRead(item.id),
      confirm(response) { item.isRead = true; store.setUnreadCount(response.unreadCount) },
    })
  } catch {} finally {
    const next = new Set(busyIds.value); next.delete(item.id); busyIds.value = next
  }
}
async function openNotification(item) {
  await markRead(item)
  if (item.type === 'follow') router.push({ name: 'public-profile', params: { username: item.Actor.username } })
  else if (item.Destination) router.push({ name: 'relato-detail', params: { id: item.Destination.id } })
}
</script>

<template>
  <main class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3"><h1 class="h2 mb-0">Notificações</h1><button class="btn btn-outline-secondary" type="button" @click="reload">Atualizar</button></div>
    <p v-if="loading && !notifications.length" class="text-muted">Carregando notificações...</p>
    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }} <button class="btn btn-link" @click="reload">Tentar novamente</button></div>
    <section v-else aria-label="Lista de notificações">
      <p v-if="!notifications.length" class="text-muted">Você ainda não tem notificações. Quando alguém curtir, comentar ou seguir você, o aviso aparecerá aqui.</p>
      <article v-for="item in notifications" :key="item.id" class="d-flex align-items-center gap-3 p-3 mb-2 rounded border" :class="item.isRead ? 'bg-white' : 'bg-light fw-bold'">
        <img :src="getProfilePictureUrl(item.Actor?.profilePicture)" alt="" class="rounded-circle flex-shrink-0" width="44" height="44" />
        <div class="flex-grow-1">
          <RouterLink class="text-decoration-none text-reset" :to="item.type === 'follow' ? { name: 'public-profile', params: { username: item.Actor?.username } } : { name: 'relato-detail', params: { id: item.Destination?.id } }" @click.prevent="openNotification(item)">
            <span>@{{ item.Actor?.username }}</span> {{ NOTIFICATION_TEXT[item.type] }}<template v-if="item.Destination">: {{ item.Destination.title }}</template>
          </RouterLink>
          <div><time class="small text-muted">{{ formatDate(item.createdAt) }}</time></div>
        </div>
        <button v-if="!item.isRead" class="btn btn-sm btn-outline-primary text-nowrap" :disabled="busyIds.has(item.id)" @click="markRead(item)">Marcar como lida</button>
      </article>
      <button v-if="hasMore" class="btn btn-outline-primary d-block mx-auto mt-3" :disabled="loading" @click="loadMore">{{ loading ? 'Carregando...' : 'Carregar mais notificações' }}</button>
      <p v-if="errorMessage && notifications.length" class="text-danger mt-3">{{ errorMessage }}</p>
    </section>
  </main>
</template>
