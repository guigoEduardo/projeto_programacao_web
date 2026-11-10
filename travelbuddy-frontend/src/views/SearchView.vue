<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '../services/searchService'
import { useAsyncData } from '../composables/useAsyncData'
import { useDebouncedValue } from '../composables/useDebouncedValue'
import { SEARCH } from '../config/constants'
import DestinationCard from '../components/DestinationCard.vue'
const route=useRoute(), router=useRouter()
const initial=typeof route.query.q==='string'?route.query.q:''
const typedText=ref(initial), term=useDebouncedValue(typedText,SEARCH.DEBOUNCE_MS), normalizedTerm=ref(initial.trim())
const input=ref(null)
const {data,loading,errorMessage,execute}=useAsyncData(q=>q.length>=SEARCH.MIN_LENGTH?search(q):Promise.resolve({data:{query:q,destinations:[],users:[]}}),{immediate:false,initialValue:{query:'',destinations:[],users:[]}})
watch(term,async value=>{normalizedTerm.value=value.trim();const q=normalizedTerm.value;if((route.query.q||'')!==q)await router.replace({name:'search',query:q?{q}:{}});execute(q).catch(()=>{})},{immediate:true})
watch(()=>route.query.q,value=>{const q=typeof value==='string'?value:'';if(q!==normalizedTerm.value)typedText.value=q})
onMounted(()=>input.value?.focus())
</script>
<template>
<section class="container py-4"><h1 class="mb-3">Explorar</h1><form role="search" @submit.prevent><label for="search-page" class="form-label">Buscar destinos e pessoas</label><input id="search-page" ref="input" v-model="typedText" class="form-control" placeholder="Digite ao menos 2 letras" /></form>
<p v-if="normalizedTerm.length<SEARCH.MIN_LENGTH" class="text-muted mt-3">Digite pelo menos {{ SEARCH.MIN_LENGTH }} letras para buscar.</p><p v-else-if="loading" class="text-muted mt-3">Buscando...</p><p v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</p>
<template v-else><h2 v-if="data?.users?.length" class="h4 mt-4">Pessoas</h2><div v-if="data?.users?.length" class="list-group mb-4"><RouterLink v-for="person in data.users" :key="person.id" :to="{name:'public-profile',params:{username:person.username}}" class="list-group-item list-group-item-action"><strong>{{person.fullName||person.username}}</strong> <span class="text-muted">@{{person.username}}</span></RouterLink></div><h2 v-if="data?.destinations?.length" class="h4">Destinos</h2><div v-if="data?.destinations?.length" class="row g-3"><div v-for="item in data.destinations" :key="item.id" class="col-md-6 col-xl-4"><DestinationCard :destination="item"/></div></div><p v-if="normalizedTerm.length>=SEARCH.MIN_LENGTH&&!data?.users?.length&&!data?.destinations?.length" class="text-muted mt-3">Nada encontrado para &ldquo;{{data?.query}}&rdquo;.</p></template>
</section></template>
