import 'dart:convert';

import 'package:equatable/equatable.dart';

Ingredient ingredientFromJson(String str) =>
    Ingredient.fromJson(json.decode(str));

class Ingredient extends Equatable {
  final String id;
  final String name;
  final String measurements;
  final String recipeId;

  const Ingredient({
    required this.id,
    required this.name,
    required this.measurements,
    required this.recipeId,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) => Ingredient(
      id: json["id"],
      name: json["name"],
      measurements: json["measurements"],
      recipeId: json["recipe_id"]);

  @override
  List<Object> get props => [id, name, measurements, recipeId];
}
