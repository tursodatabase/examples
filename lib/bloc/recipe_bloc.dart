import 'package:app_recipe_book/models/models.dart';
import 'package:app_recipe_book/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'recipe_event.dart';
part 'recipe_state.dart';

class RecipeBloc extends Bloc<RecipeEvent, RecipeState> {
  final TursoRepository _tursoRepository;
  RecipeBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(RecipeInitial()) {
    on<RecipeEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshRecipes) {
        List<Recipe> recipes = await _tursoRepository.getRecipes();
        emit(RecipesFetched(recipes: recipes));
      }
      if (event is DetailsInitial) {
        Recipe? recipe = await _tursoRepository.getRecipe(id: event.recipeId);
        emit(recipe != null ? RecipeFetched(recipe: recipe) : RecipeNotFound());
      }
      if (event is AddRecipe) {
        bool added = await tursoRepository.addRecipe(recipe: event.recipe);
        emit(added ? RecipeAdditionSuccess() : RecipeAdditionFailure());
      }
      if (event is DeleteRecipe) {
        bool deleted = await tursoRepository.deleteRecipe(recipe: event.recipe);
        emit(deleted ? RecipeDeletionSuccess() : RecipeDeletionFailure());
      }
    });
  }
}
