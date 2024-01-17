import 'package:app_recipe_book/bloc/recipe_bloc.dart';
import 'package:app_recipe_book/screens/home_screen.dart';
import 'package:app_recipe_book/screens/new_recipe_screen.dart';
import 'package:app_recipe_book/screens/recipe_details_screen.dart';
import 'package:app_recipe_book/repositories/turso_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return RepositoryProvider(
      create: (context) {
        return TursoRepository();
      },
      child: BlocProvider<RecipeBloc>(
        create: (context) {
          // final tursoRestApiClient =
          //     RepositoryProvider.of<TursoRestAPIClient>(context);
          final tursoRepository =
              RepositoryProvider.of<TursoRepository>(context);
          return RecipeBloc(tursoRepository);
        },
        child: MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'My Recipe Book',
          theme: ThemeData(
            // This is the theme of your application.
            //
            // TRY THIS: Try running your application with "flutter run". You'll see
            // the application has a purple toolbar. Then, without quitting the app,
            // try changing the seedColor in the colorScheme below to Colors.green
            // and then invoke "hot reload" (save your changes or press the "hot
            // reload" button in a Flutter-supported IDE, or press "r" if you used
            // the command line to start the app).
            //
            // Notice that the counter didn't reset back to zero; the application
            // state is not lost during the reload. To reset the state, use hot
            // restart instead.
            //
            // This works for code too, not just values: Most code changes can be
            // tested with just a hot reload.
            colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
            useMaterial3: true,
          ),
          routes: {
            '/': (context) => const HomeScreen(),
            '/new-recipe': (context) => const NewRecipeScreen(),
            RecipeDetailsScreen.routeName: (context) =>
                const RecipeDetailsScreen(),
          },
        ),
      ),
    );
  }
}
