import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

import { Ingredient, Recipe } from 'src/components/models';
import { ref } from 'vue';

export const useDatabaseStore = defineStore('database', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoading = ref<boolean>(false);

  async function fetchAllRecipes() {
    isLoading.value = false;
    const { data } = await api.get('/recipes');

    const allRecipes = data.recipes.map(
      (data: Recipe & { ingredients: string }) => {
        const { ingredients, ...recipe } = data;

        return {
          ...recipe,
          ingredients: ingredients !== undefined ? JSON.parse(ingredients) : [],
        } as unknown as Recipe;
      }
    ) as Recipe[];

    recipes.value = allRecipes;
    isLoading.value = false;
  }

  async function addRecipe({
    recipe,
    ingredients,
  }: {
    recipe: Recipe;
    ingredients: Ingredient[];
  }) {
    isLoading.value = true;
    await api.post<Recipe[]>('/recipe', {
      recipe: recipe,
      ingredients,
    });

    fetchAllRecipes();
  }

  function getRecipeById(id: string): Recipe | undefined {
    return recipes.value.filter((recipe) => recipe.id === id)[0];
  }

  async function deleteRecipe(recipe: Recipe) {
    isLoading.value = true;
    await api.delete(`/recipe/${recipe.id}`);
    fetchAllRecipes();
    isLoading.value = false;
  }

  return {
    recipes,
    isLoading,
    fetchAllRecipes,
    getRecipeById,
    addRecipe,
    deleteRecipe,
  };
});
