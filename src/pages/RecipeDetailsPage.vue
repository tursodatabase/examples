<template>
  <q-card flat class="my-card" v-if="recipe !== undefined">
    <q-card-section>
      <div class="text-h6">{{ recipe.name }}</div>
    </q-card-section>

    <q-item-label overline class="q-pa-md">Instructions</q-item-label>

    <q-card-section class="q-pt-none">
      <p>
        {{ recipe.instructions }}
      </p>
    </q-card-section>

    <q-item-label overline class="q-pa-md">Ingredients</q-item-label>

    <q-card-section
      class="q-pt-none"
      v-for="ingredient of recipe.ingredients"
      :key="ingredient.id"
    >
      <q-item-label overline>{{ ingredient.name }}</q-item-label>
      <q-item-label caption>{{ ingredient.measurements }}</q-item-label>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <!-- {{ recipe.nutritionInformation }} -->
    </q-card-section>

    <q-item-label overline class="q-pa-md">Nutrition</q-item-label>

    <q-card-section class="q-pt-none">
      <p>{{ recipe.nutritionInformation }}</p>
    </q-card-section>

    <q-card-section>
      <q-btn color="accent" :loading="isLoading" @click="remove()"
        >Delete</q-btn
      >
    </q-card-section>
  </q-card>
  <div v-else>Recipe not found!</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Recipe } from 'src/components/models';
import { useDatabaseStore } from 'src/stores/database';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useDatabaseStore();
const route = useRoute();
const router = useRouter();

const { getRecipeById, deleteRecipe } = store;
const { isLoading } = storeToRefs(store);

const recipe = getRecipeById(route.params.id as string);

const remove = async () => {
  await deleteRecipe(recipe as Recipe);

  watch(isLoading, (loading) => {
    if (!loading) {
      router.push({ path: '/' });
    }
  });
};
</script>
