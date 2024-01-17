<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="recipe.name"
        label="Name"
        hint="Recipe name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        autogrow
        v-model="recipe.nutritionInformation"
        type="textarea"
        label="Nutritions"
        hint="Nutritional Information"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Add nutritional information',
        ]"
      />

      <q-input
        filled
        autogrow
        v-model="recipe.instructions"
        type="textarea"
        label="Instructions"
        hint="Preparation instructions"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Add preparation instructions',
        ]"
      />

      <div class="q-gutter-sm">
        <q-separator />

        <q-item-section>Ingredients</q-item-section>

        <div
          class="col items-start q-gutter-sm"
          v-for="(ingredient, index) in ingredients"
          :key="index"
        >
          <q-input
            class="width: 100%"
            filled
            v-model="ingredient.name"
            label="Ingredient"
            hint="Ingredient name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            class="width: 100%"
            filled
            v-model="ingredient.measurements"
            label="Measurements"
            hint="Ingredient measurements"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <div class="q-gutter-x-sm">
            <q-btn
              v-if="ingredients.length === index + 1"
              label="Add Ingredient"
              type="button"
              @click="addIngredient()"
              color="primary"
            />
            <q-btn
              v-if="index > 0 && ingredients.length === index + 1"
              label="Remove Ingredient"
              type="button"
              @click="removeIngredient()"
              color="accent"
            />
          </div>
        </div>
      </div>

      <q-separator />

      <div>
        <q-btn
          label="Submit"
          :loading="isLoading"
          type="submit"
          color="primary"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  Ingredient,
  IngredientForm,
  Recipe,
  RecipeForm,
} from 'src/components/models';
import { useDatabaseStore } from 'src/stores/database';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const store = useDatabaseStore();
const { addRecipe } = store;
const { isLoading } = storeToRefs(store);

const recipe = ref<RecipeForm>({
  name: '',
  nutritionInformation: '',
  instructions: '',
});
const ingredients = ref<IngredientForm[]>([
  {
    name: '',
    measurements: '',
  },
]);

const addIngredient = () =>
  ingredients.value.push({
    name: '',
    measurements: '',
  });
const removeIngredient = () => ingredients.value.pop();

const onSubmit = () => {
  addRecipe({
    recipe: recipe.value as unknown as Recipe,
    ingredients: ingredients.value as unknown as Ingredient[],
  });

  watch(isLoading, (loading) => {
    if (!loading) {
      router.push({ path: '/' });
    }
  });
};
const onReset = () => {
  recipe.value = { name: '', nutritionInformation: '', instructions: '' };
  ingredients.value = [
    {
      name: '',
      measurements: '',
    },
  ];
};
</script>
