import 'package:app_recipe_book/bloc/recipe_bloc.dart';
import 'package:app_recipe_book/models/models.dart';
import 'package:app_recipe_book/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

/// Details screen arguments
class RecipeDetailsScreenArguments {
  final Recipe recipe;

  RecipeDetailsScreenArguments(this.recipe);
}

class RecipeDetailsScreen extends StatefulWidget {
  const RecipeDetailsScreen({super.key});
  static const routeName = '/details';

  @override
  RecipeDetailsScreenState createState() => RecipeDetailsScreenState();
}

class RecipeDetailsScreenState extends State<RecipeDetailsScreen> {
  List<Widget> ingredientsList(List<Ingredient> ingredients) {
    List<Widget> widgets = <Widget>[];
    for (Ingredient ingredient in ingredients) {
      widgets.addAll([
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(5),
              width: MediaQuery.of(context).size.width - 48,
              child: Text(
                ingredient.name,
              ),
            )
          ],
        ),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              width: MediaQuery.of(context).size.width - 48,
              child: Text(
                ingredient.measurements,
                style: const TextStyle(color: Colors.blueGrey),
              ),
            )
          ],
        ),
      ]);
    }
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments
        as RecipeDetailsScreenArguments;
    final recipesBloc = BlocProvider.of<RecipeBloc>(context);
    recipesBloc.add(DetailsInitial(recipeId: args.recipe.id));

    return Scaffold(
      appBar: AppBar(
          title: const Text("Recipe Details"),
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          leading: IconButton(
              onPressed: () {
                Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const HomeScreen()),
                    (route) => false);
              },
              icon: const Icon(Icons.chevron_left))),
      body: BlocConsumer<RecipeBloc, RecipeState>(
        listener: (context, state) {
          if (state is RecipeNotFound) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text("Recipe not found!"),
              backgroundColor: Colors.red,
            ));
          }
          if (state is RecipeDeletionSuccess) {
            Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const HomeScreen()),
                (route) => false);
          }
          if (state is RecipeDeletionFailure) {
            /// show message saying deletion failed
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text("Failed to delete recipe"),
              backgroundColor: Colors.red,
            ));
          }
        },
        builder: (context, state) {
          if (state is RecipeInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is RecipeFetched) {
            return ListView(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          SizedBox(
                              height: 50,
                              child: Text(state.recipe.name,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleLarge
                                      ?.copyWith(fontWeight: FontWeight.w500))),
                        ],
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Row(
                        children: [
                          Text("Instructions",
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyLarge
                                  ?.copyWith(fontWeight: FontWeight.w500))
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Row(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(8),
                              child: SizedBox(
                                width: MediaQuery.of(context).size.width - 48,
                                child: Text(state.recipe.instructions),
                              ),
                            )
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Row(
                        children: [
                          Text("Ingredients",
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyLarge
                                  ?.copyWith(fontWeight: FontWeight.w500))
                        ],
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Column(
                        children: [
                          Flex(
                            direction: Axis.vertical,
                            children: state.recipe.ingredients != null
                                ? ingredientsList(state.recipe.ingredients
                                    as List<Ingredient>)
                                : [],
                          )
                        ],
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Row(
                        children: [
                          Text("Nutrition",
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyLarge
                                  ?.copyWith(fontWeight: FontWeight.w500))
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Row(
                          children: [
                            Flex(
                              direction: Axis.vertical,
                              children: [
                                Text(state.recipe.nutritionInformation)
                              ],
                            )
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 50),
                        child: ElevatedButton(
                            onPressed: () {
                              recipesBloc
                                  .add(DeleteRecipe(recipe: state.recipe));
                            },
                            child: const Center(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.delete,
                                    color: Colors.red,
                                  ),
                                  SizedBox(
                                    width: 2,
                                  ),
                                  Text(
                                    "Delete Recipe",
                                    style: TextStyle(color: Colors.red),
                                  )
                                ],
                              ),
                            )),
                      ),
                    ],
                  ),
                )
              ],
            );
          }
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }
}
