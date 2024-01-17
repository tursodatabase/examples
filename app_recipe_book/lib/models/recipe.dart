import 'dart:convert';

import 'package:equatable/equatable.dart';

import 'ingredient.dart';

Recipe recipeFromJson(String str) => Recipe.fromJson(json.decode(str));

class Recipe extends Equatable {
  final String id;
  final String name;
  final String nutritionInformation;
  final String instructions;
  final List<Ingredient>? ingredients;

  const Recipe(
      {required this.id,
      required this.name,
      required this.nutritionInformation,
      required this.instructions,
      this.ingredients});

  factory Recipe.fromJson(Map<String, dynamic> json) => Recipe(
      id: json["id"],
      name: json["name"],
      nutritionInformation: json["nutrition_information"],
      instructions: json["instructions"],
      ingredients: json["ingredients"] != null
          ? List<Ingredient>.from(jsonDecode(json["ingredients"])
              .map((ingredient) => Ingredient.fromJson(ingredient)))
          : []);

  @override
  List<Object?> get props =>
      [id, name, nutritionInformation, instructions, ingredients];
}
