part of 'recipe_bloc.dart';

sealed class RecipeEvent extends Equatable {
  const RecipeEvent();

  @override
  List<Object> get props => [];
}

class Initial extends RecipeEvent {}

class DetailsInitial extends RecipeEvent {
  const DetailsInitial({required this.recipeId});

  final String recipeId;

  @override
  List<Object> get props => [recipeId];
}

class RefreshRecipes extends RecipeEvent {}

class DeleteRecipe extends RecipeEvent {
  const DeleteRecipe({required this.recipe});

  final Recipe recipe;

  @override
  List<Object> get props => [recipe];
}

class AddRecipe extends RecipeEvent {
  const AddRecipe({required this.recipe});

  final Map<String, dynamic> recipe;

  @override
  List<Object> get props => [recipe];
}
