import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:uuid/v4.dart';

import '../models/models.dart';

/// Exception thrown when getRecipes fails.
class TursoHttpException implements Exception {
  final String message;

  TursoHttpException({required this.message});
}

///Exception thrown when the provided results are not found.
class ResultsNotFound implements Exception {}

class TursoRestAPIClient {
  static const String dbUrl =
      String.fromEnvironment("TURSO_URL", defaultValue: "");
  static const String authToken =
      String.fromEnvironment("TURSO_AUTH_TOKEN", defaultValue: "");

  /// Runs queries on the Turso database
  ///
  /// Takes a {sql} [SQL query] and a dynamic list of {arguments}
  ///
  /// Throws an Exception when the number of arguments doesn't
  /// match the number of placeholders within the query
  Future<http.Response> runQuery(
      {required dynamic sql,
      List<dynamic>? arguments,
      bool batch = false}) async {
    if (arguments != null) {
      RegExp placeholder = RegExp(r'[?]');
      Iterable<Match> matches = placeholder.allMatches(sql);

      if (matches.length == arguments.length) {
        return await http.post(Uri.parse(dbUrl),
            headers: {
              HttpHeaders.authorizationHeader: "Bearer $authToken",
              HttpHeaders.contentTypeHeader: "application/json"
            },
            body: json.encode({
              "statements": [
                {"q": sql, "params": arguments}
              ]
            }));
      }
      throw Exception("arguments do not match placeholder count");
    }

    return http.post(Uri.parse(dbUrl),
        headers: {
          HttpHeaders.authorizationHeader: "Bearer $authToken",
          HttpHeaders.contentTypeHeader: "application/json"
        },
        body: json.encode({
          // "statements": ["$sql"]
          "statements": batch ? sql : ["$sql"]
        }));
  }

  /// Fetches all recipes from the API
  Future<List<Recipe>> getRecipes() async {
    try {
      final recipesResponse = await runQuery(
          sql:
              "select id, name, nutrition_information, instructions from recipes");

      final recipesJson = jsonDecode(recipesResponse.body);

      if (!recipesJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = recipesJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          recipesJson[0]["results"]["rows"].map((dynamic recipe) => {
                "${columns[0]}": recipe[0],
                "${columns[1]}": recipe[1],
                "${columns[2]}": recipe[2],
                "${columns[3]}": recipe[3],
              }));

      if (results.isEmpty) return <Recipe>[];

      return List<Recipe>.from(
          results.map((result) => Recipe.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Recipe>[];
    }
  }

  /// Fetches recipe from the API
  Future<Recipe?> getRecipe({required String recipeId}) async {
    try {
      final recipeResponse = await runQuery(
          sql:
              "select recipes.id, recipes.name, recipes.nutrition_information, recipes.instructions, json_group_array(json_object('id', ingredients.id, 'name', ingredients.name, 'measurements', ingredients.measurements, 'recipe_id', ingredients.recipe_id)) as ingredients from recipes right join ingredients on ingredients.recipe_id = recipes.id where recipes.id = ?",
          arguments: [recipeId]);

      final recipeJson = jsonDecode(recipeResponse.body);

      if (!recipeJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = recipeJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          recipeJson[0]["results"]["rows"].map((dynamic recipe) {
        return {
          "${columns[0]}": recipe[0],
          "${columns[1]}": recipe[1],
          "${columns[2]}": recipe[2],
          "${columns[3]}": recipe[3],
        };
      }));

      return Recipe.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  /// Adds recipe to Turso database
  /// Requires uuid [id] and recipe
  Future<bool> addRecipe(String id,
      {required Map<String, dynamic> recipe}) async {
    try {
      final addResponse = await runQuery(
          sql:
              "insert into recipes(id, name, nutrition_information, instructions) values (?, ?, ?, ?)",
          arguments: [
            id,
            recipe["name"],
            recipe["nutrition_information"],
            recipe["instructions"],
          ]);
      if (addResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to add recipe");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Adds [ingredients] to the database
  Future<bool> addIngredients(
      {required List<Map<String, dynamic>> ingredients,
      required String recipeId}) async {
    List<Map<String, dynamic>> statements =
        List<Map<String, dynamic>>.from(ingredients.map((ingredient) => {
              "q":
                  "insert into ingredients(id, name, measurements, recipe_id) values (?, ?, ?, ?)",
              "params": [
                (const UuidV4().generate()),
                ingredient["name"],
                ingredient["measurements"],
                recipeId
              ]
            }));

    try {
      final addResponse = await runQuery(sql: statements, batch: true);
      if (addResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to add ingredients");
      }
      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Deletes the recipe with the given [id]
  Future<bool> deleteRecipe({required String id}) async {
    try {
      final deleteResponse = await runQuery(
          sql: "delete from recipes where id = ?", arguments: [id]);

      if (deleteResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to delete recipe");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Deletes all ingredients with given [recipeId]
  Future<bool> deleteIngredients({required String recipeId}) async {
    try {
      final deleteResponse = await runQuery(
          sql: "delete from ingredients where recipe_id = ?",
          arguments: [recipeId]);

      if (deleteResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to delete ingredients");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }
}
