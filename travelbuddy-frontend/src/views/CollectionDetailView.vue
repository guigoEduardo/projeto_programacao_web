<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCollection, removeDestinationFromCollection } from '../services/collectionService'
import { useAsyncData } from '../composables/useAsyncData'
import { useToast } from '../composables/useToast'
import DestinationCard from '../components/DestinationCard.vue'
const route=useRoute(),router=useRouter(),toast=useToast(),items=ref([]),isOwner=ref(false),collection=ref(null),removing=ref(new Set())
const {loading,errorMessage,execute}=useAsyncData(async(id,signal)=>{const r=await getCollection(id,signal);return r.data},{immediate:false})
watch(()=>route.params.id,async id=>{try{const data=await execute(id);collection.value=data;items.value=data.destinations||[];isOwner.value=data.isOwner}catch{}},{immediate:true})
async function remove(item){if(removing.value.has(item.id))return;removing.value=new Set(removing.value).add(item.id);try{const r=await removeDestinationFromCollection(collection.value.id,item.id);items.value=items.value.filter(x=>x.id!==item.id);collection.value.destinationsCount=r.data.destinationsCount;toast.success('Destino removido da coleção.')}finally{const n=new Set(removing.value);n.delete(item.id);removing.value=n}}
</script>
<template><section class="container py-4"><p v-if="loading">Carregando coleção…</p><div v-else-if="errorMessage" class="alert alert-warning"><h1 class="h4">{{errorMessage.includes('privada')?'Coleção privada':'Coleção não encontrada'}}</h1><p>{{errorMessage}}</p><RouterLink class="btn btn-outline-secondary" :to="{name:'feed'}">Voltar ao feed</RouterLink></div><template v-else-if="collection"><div class="mb-4"><span class="badge" :class="collection.isPublic?'bg-success':'bg-secondary'">{{collection.isPublic?'Pública':'Privada'}}</span><h1 class="mt-2">{{collection.title}}</h1><p v-if="collection.description">{{collection.description}}</p><p class="text-muted">por @{{collection.User?.username}} · {{items.length}} {{items.length===1?'destino':'destinos'}}</p></div><div v-if="!items.length" class="alert alert-light">{{isOwner?'Esta coleção está vazia. Salve destinos nela.':'Esta coleção ainda não tem destinos.'}}</div><div v-else class="row g-3"><div v-for="item in items" :key="item.id" class="col-md-6 col-xl-4"><DestinationCard :destination="item"><template v-if="isOwner" #actions><button class="btn btn-sm btn-outline-danger" :disabled="removing.has(item.id)" @click="remove(item)">Remover da coleção</button></template></DestinationCard></div></div></template></section></template>
