<template>
  <div class="q-pa-md">
    <q-list separator>
      <q-item
        clickable
        v-ripple
        v-for="recipe of recipes"
        :key="recipe.id"
        :to="`/recipe/${recipe.id}`"
      >
        <q-item-section>
          <q-item-label overline>{{ recipe.name }}</q-item-label>
          <q-item-label caption>{{
            recipe.nutritionInformation?.slice(0, 20) + '...'
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDatabaseStore } from 'src/stores/database';

const store = useDatabaseStore();
const { recipes } = storeToRefs(store);
const { fetchAllRecipes } = store;

fetchAllRecipes();
</script>
