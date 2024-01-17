export interface Recipe {
  id: string;
  name: string;
  nutritionInformation?: string;
  instructions?: string;
  createdAt: number;
  updatedAt: number;
  ingredients?: Ingredient[];
}

export interface RecipeForm {
  name: string;
  nutritionInformation?: string;
  instructions?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  measurements: string;
  recipeid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IngredientForm {
  name: string;
  measurements: string;
}
