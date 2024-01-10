library turso_repository;

import 'package:app_recipe_book/models/recipe.dart';
import 'package:app_recipe_book/data_sources/turso_rest_api_client.dart';
import 'package:uuid/v4.dart';

/// Turso repository
/// Provides an interface that abstracts the data provider
class TursoRepository {
  TursoRepository({TursoRestAPIClient? tursoRestAPIClient})
      : _tursoRestAPIClient = tursoRestAPIClient ?? TursoRestAPIClient();

  final TursoRestAPIClient _tursoRestAPIClient;

  /// Fetches a List<Recipe>
  Future<List<Recipe>> getRecipes() async {
    final recipes = await _tursoRestAPIClient.getRecipes();
    return recipes;
  }

  /// Fetches a single Recipe
  Future<Recipe?> getRecipe({required String id}) async {
    final recipe = await _tursoRestAPIClient.getRecipe(recipeId: id);
    return recipe;
  }

  /// Adds a new recipe from the provided [recipe] data
  Future<bool> addRecipe({required Map<String, dynamic> recipe}) async {
    String recipeId = (const UuidV4().generate());
    final addedRecipe =
        await _tursoRestAPIClient.addRecipe(recipeId, recipe: recipe);
    final addedNutrients = await _tursoRestAPIClient.addIngredients(
        ingredients: recipe["ingredients"], recipeId: recipeId.toString());

    return addedRecipe && addedNutrients;
  }

  /// Deletes the passed [recipe]
  Future<bool> deleteRecipe({required Recipe recipe}) async {
    final deletedIngredients =
        await _tursoRestAPIClient.deleteIngredients(recipeId: recipe.id);
    final deletedRecipes =
        await _tursoRestAPIClient.deleteRecipe(id: recipe.id);
    return deletedIngredients && deletedRecipes;
  }
}
