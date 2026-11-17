import { ref, watch, unref } from 'vue'
import { PAGINATION } from '../config/constants'
export function usePaginatedList(fetchPage,{limit=PAGINATION.DEFAULT_LIMIT,unique=false,watch:source}={}){
 const items=ref([]),page=ref(PAGINATION.DEFAULT_PAGE),hasMore=ref(true),loading=ref(false),errorMessage=ref('');let request=0
 async function loadMore(){if(loading.value||!hasMore.value)return;const id=++request;loading.value=true;errorMessage.value='';try{const response=await fetchPage(page.value,limit);if(id!==request)return;const batch=response?.data??response??[];if(unique){const known=new Set(items.value.map(x=>x.id));items.value.push(...batch.filter(x=>!known.has(x.id)))}else items.value.push(...batch);hasMore.value=batch.length===limit;page.value++}catch(error){if(id===request)errorMessage.value=error.message||'Não foi possível carregar os itens.'}finally{if(id===request)loading.value=false}}
 async function reload(){request++;loading.value=false;items.value=[];page.value=1;hasMore.value=true;await loadMore()}
 if(source!==undefined)watch(()=>unref(source),()=>reload(),{flush:'sync'})
 return{items,page,hasMore,loading,errorMessage,loadMore,reload}
}
