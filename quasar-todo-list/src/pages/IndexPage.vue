<template>
  <div class="q-pa-md">
    <q-list dense bordered class="rounded-borders">
      <q-item clickable v-ripple v-for="todo of myTodos" :key="todo.id">
        <q-item-section>
          {{todo.task}}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {createClient} from '@libsql/client/web';
import {useAsyncState} from '@vueuse/core';

const db = createClient({
  url: import.meta.env.VITE_TURSO_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

const {state, isLoading} = useAsyncState(
  db.execute('select * from todos'),
  null
);

const myTodos = ref();

watch(isLoading, (loading) => {
  if(!loading){
    console.log({state})
    myTodos.value = state.value?.rows
  }
});
</script>
