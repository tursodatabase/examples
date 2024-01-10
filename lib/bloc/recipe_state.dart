part of 'recipe_bloc.dart';

sealed class RecipeState extends Equatable {
  const RecipeState();

  @override
  List<Object> get props => [];
}

final class RecipeInitial extends RecipeState {}

class Loading extends RecipeState {}

class RecipesFetched extends RecipeState {
  const RecipesFetched({required this.recipes});

  final List<Recipe> recipes;

  @override
  List<Object> get props => [recipes];
}

class RecipeFetched extends RecipeState {
  const RecipeFetched({required this.recipe});

  final Recipe recipe;

  @override
  List<Object> get props => [recipe];
}

class RecipeNotFound extends RecipeState {}

class RecipeDeletionFailure extends RecipeState {}

class RecipeDeletionSuccess extends RecipeState {}

class RecipeAdditionSuccess extends RecipeState {}

class RecipeAdditionFailure extends RecipeState {}
