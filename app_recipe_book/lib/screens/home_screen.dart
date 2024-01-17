import 'package:app_recipe_book/bloc/recipe_bloc.dart';
import 'package:app_recipe_book/models/models.dart';
import 'package:app_recipe_book/screens/recipe_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final recipesBloc = BlocProvider.of<RecipeBloc>(context);
    recipesBloc.add(Initial());
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [Text("My Recipe Book")]),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/new-recipe");
                },
                child: const Row(
                  children: [
                    Icon(Icons.add),
                    SizedBox(
                      width: 2,
                    ),
                    Icon(Icons.restaurant)
                  ],
                )),
          )
        ],
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: BlocConsumer<RecipeBloc, RecipeState>(
        listener: (context, state) {},
        builder: (context, state) {
          if (state is RecipeInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is RecipesFetched) {
            if (state.recipes.isNotEmpty) {
              return ListView.builder(
                  // padding: const EdgeInsets.all(20.0),
                  itemCount: state.recipes.length,
                  itemBuilder: (BuildContext context, int index) {
                    Recipe recipe = state.recipes[index];
                    return ListTile(
                      title: Text(recipe.name),
                      subtitle: Text(
                          "${recipe.instructions.length > 15 ? recipe.instructions.substring(0, 15) : recipe.instructions}..",
                          style: const TextStyle(color: Colors.grey)),
                      splashColor: Theme.of(context).colorScheme.inversePrimary,
                      focusColor: Colors.white,
                      onTap: () {
                        Navigator.pushNamed(
                            context, RecipeDetailsScreen.routeName,
                            arguments: RecipeDetailsScreenArguments(
                                state.recipes[index]));
                      },
                    );
                  });
            } else {
              return Center(
                child: SizedBox(
                  width: 200,
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pushNamed("/new-recipe");
                      },
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.restaurant),
                          SizedBox(
                            width: 8,
                          ),
                          Text("Add Recipe")
                        ],
                      )),
                ),
              );
            }
          }
          return Center(
            child: SizedBox(
              width: 200,
              child: ElevatedButton(
                  onPressed: () {
                    recipesBloc.add(RefreshRecipes());
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.refresh),
                      SizedBox(
                        width: 8,
                      ),
                      Text("Refresh!")
                    ],
                  )),
            ),
          );
        },
      ),
    );
  }
}
