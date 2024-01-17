<template>
  <div class="q-pa-md">
    <q-list separator v-if="recipes.length > 0">
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
    <div
      class="column flex-center items-center q-pa-md"
      style="height: 100vh; width: 100%"
      v-else
    >
      <div class="col-12 self-center" style="height: 100px">
        <q-btn
          to="/add-recipe"
          color="primary"
          icon-right="local_dining"
          label="Add a recipe"
        />
      </div>
    </div>
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
