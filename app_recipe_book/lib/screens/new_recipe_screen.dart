import 'package:app_recipe_book/bloc/recipe_bloc.dart';
import 'package:app_recipe_book/screens/home_screen.dart';
import 'package:app_recipe_book/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class NewRecipeScreen extends StatefulWidget {
  const NewRecipeScreen({super.key});

  @override
  NewRecipeScreenState createState() => NewRecipeScreenState();
}

class NewRecipeScreenState extends State<NewRecipeScreen> {
  final GlobalKey<FormState> _recipeFormKey = GlobalKey<FormState>();
  final AutovalidateMode _autoValidateMode = AutovalidateMode.disabled;

  /// form field decoration style
  final InputDecoration _formFieldDecoration = const InputDecoration(
      border: OutlineInputBorder(),
      isDense: true,
      contentPadding: EdgeInsets.all(15));

  TextEditingController recipeNameController = TextEditingController(text: "");
  Widget recipeNameFormField({String validationText = "Name is required"}) =>
      TextFormField(
        controller: recipeNameController,
        decoration: const InputDecoration(
            labelText: 'Recipe Name',
            border: OutlineInputBorder(),
            isDense: true,
            contentPadding: EdgeInsets.all(15)),
        autocorrect: false,
        validator: (val) => formValidation(val, validationText),
        onChanged: (value) {
          setState(() {
            recipeNameController.text = value;
          });
        },
      );
  TextEditingController nutritionInformationController =
      TextEditingController(text: "");
  Widget nutritionalInformationFormField(
          {String validationText = "Nutritional information is required"}) =>
      TextFormField(
        controller: nutritionInformationController,
        keyboardType: TextInputType.multiline,
        minLines: 3,
        maxLines: 5,
        decoration: const InputDecoration(
            labelText: 'Nutritional Information',
            border: OutlineInputBorder(),
            isDense: true,
            contentPadding: EdgeInsets.all(15)),
        autocorrect: false,
        validator: (val) => formValidation(val, validationText),
        onChanged: (value) {
          setState(() {
            nutritionInformationController.text = value;
          });
        },
      );
  TextEditingController preparationInstructionsController =
      TextEditingController(text: "");
  Widget preparationInstructionsFormField(
          {String validationText = "Rig name is required"}) =>
      TextFormField(
        controller: preparationInstructionsController,
        keyboardType: TextInputType.multiline,
        minLines: 3,
        maxLines: 5,
        decoration: const InputDecoration(
            labelText: 'Preparation Instructions',
            border: OutlineInputBorder(),
            isDense: true,
            contentPadding: EdgeInsets.all(15)),
        autocorrect: false,
        validator: (val) => formValidation(val, validationText),
        onChanged: (value) {
          setState(() {
            preparationInstructionsController.text = value;
          });
        },
      );

  List<Map<String, dynamic>> ingredientsControllersArray = [];
  List<Map<String, dynamic>> ingredientsInputFormFieldsArray = [];
  Widget ingredientsColumn(BuildContext context, Size size) {
    List<Widget> ingredientsWidgetsList = [];
    for (var i = 0; i < ingredientsControllersArray.length; i++) {
      ingredientsWidgetsList.add(nutritionBlock(context, i, size: size));
      if (i + 1 == ingredientsControllersArray.length) {
        ingredientsWidgetsList.add(Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          mainAxisSize: MainAxisSize.max,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                removeIngredientsBlock();
              },
              child: const Row(
                children: [
                  Icon(
                    Icons.remove,
                    color: Colors.red,
                  ),
                ],
              ),
            ),
            ElevatedButton(
                onPressed: () {
                  addIngredientsBlock();
                },
                child: const Row(
                  children: [
                    Icon(
                      Icons.add,
                      color: Colors.green,
                    ),
                  ],
                )),
          ],
        ));
      }
    }
    return Column(
        children: ingredientsWidgetsList.isEmpty
            ? [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  mainAxisSize: MainAxisSize.max,
                  children: <Widget>[
                    ElevatedButton(
                        onPressed: () {
                          addIngredientsBlock();
                        },
                        child: const Row(
                          children: [Text("Add Ingredient")],
                        )),
                  ],
                )
              ]
            : ingredientsWidgetsList);
  }

  TextFormField ingredientTextFormWidget(
          {required int index,
          required String property,
          required String validationText,
          required String labelText}) =>
      TextFormField(
          validator: (val) => formValidation(val, validationText),
          onChanged: (value) {
            setState(() {
              ingredientsControllersArray[index][property].text = value;
            });
          },
          autocorrect: false,
          decoration: _formFieldDecoration.copyWith(labelText: labelText));

  /// Adds an ingredients widgets block
  void addIngredientsBlock() {
    setState(() {
      ingredientsControllersArray.add({
        'ingredient': TextEditingController(),
        'measurements': TextEditingController(),
      });
      ingredientsInputFormFieldsArray.add({
        'ingredient': ingredientTextFormWidget(
            index: ingredientsControllersArray.length - 1,
            validationText: "Fill in the ingredient",
            property: "ingredient",
            labelText: "Ingredient Name"),
        'measurements': ingredientTextFormWidget(
            index: ingredientsControllersArray.length - 1,
            validationText: "Fill in the measurements",
            property: "measurements",
            labelText: "Ingredient Measurements"),
      });
    });
  }

  /// Remove ingredients widget block
  void removeIngredientsBlock() {
    if (ingredientsControllersArray.isNotEmpty) {
      setState(() {
        ingredientsInputFormFieldsArray.removeLast();
        ingredientsControllersArray.removeLast();
      });
    }
  }

  /// A nutrition widget block
  Widget nutritionBlock(BuildContext context, int index,
          {required Size size}) =>
      Container(
          margin: const EdgeInsets.all(5),
          padding: const EdgeInsets.all(10),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Container(
                      width: size.width.toDouble() - 30,
                      color: Colors.white,
                      child: ingredientsInputFormFieldsArray[index]
                          ["ingredient"]),
                ],
              ),
              verticalDivider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Container(
                      width: size.width.toDouble() - 30,
                      color: Colors.white,
                      child: ingredientsInputFormFieldsArray[index]
                          ["measurements"]),
                ],
              )
            ],
          ));

  /// Resets all form fields
  void resetAllFields() {
    setState(() {
      recipeNameController = TextEditingController(text: "");
      nutritionInformationController = TextEditingController(text: "");
      preparationInstructionsController = TextEditingController(text: "");
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final recipesBloc = BlocProvider.of<RecipeBloc>(context);

    return Scaffold(
      appBar: AppBar(
          title: const Text("Add new recipe"),
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          leading: IconButton(
              onPressed: () {
                Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const HomeScreen()),
                    (route) => false);
              },
              icon: const Icon(Icons.chevron_left))),
      body: Form(
        key: _recipeFormKey,
        autovalidateMode: _autoValidateMode,
        child: ListView(children: <Widget>[
          Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(vertical: 10),
              margin: const EdgeInsets.only(
                left: 10,
                right: 10,
                bottom: 10,
              ),
              decoration: BoxDecoration(
                  border: Border(
                      bottom:
                          BorderSide(color: Colors.grey.shade600, width: 1))),
              child: Row(
                children: [
                  Text(
                    'Recipe Information',
                    style: TextStyle(fontSize: 22, color: Colors.grey.shade600),
                  )
                ],
              )),
          Container(
            padding: const EdgeInsets.all(10),
            child: recipeNameFormField(),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            child: nutritionalInformationFormField(),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            child: preparationInstructionsFormField(),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            child: const Text("Ingredients"),
          ),
          ingredientsColumn(context, MediaQuery.of(context).size),
          verticalDivider(size: 20),
          Container(
              height: 50,
              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
              child: BlocConsumer<RecipeBloc, RecipeState>(
                listener: (context, state) {
                  if (state is RecipeAdditionSuccess) {
                    Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const HomeScreen()),
                        (route) => false);
                  }
                  if (state is RecipeAdditionFailure) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text("Failed to add recipe"),
                      backgroundColor: Colors.red,
                    ));
                  }
                },
                builder: (context, state) {
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20.0),
                    child: ElevatedButton(
                      onPressed: () {
                        // validate fields
                        ScaffoldFeatureController<SnackBar,
                                SnackBarClosedReason>
                            formAlert({required String message}) {
                          return ScaffoldMessenger.of(context)
                              .showSnackBar(SnackBar(
                            content: Text(message),
                            backgroundColor: Colors.red,
                          ));
                        }

                        if (recipeNameController.text.isEmpty) {
                          formAlert(message: "Recipe name is required");
                          return;
                        }
                        if (nutritionInformationController.text.isEmpty) {
                          formAlert(
                              message: "Nutrition information is required");
                          return;
                        }
                        if (preparationInstructionsController.text.isEmpty) {
                          formAlert(
                              message: "Preparation instructions are required");
                          return;
                        }
                        if (ingredientsControllersArray.isEmpty) {
                          formAlert(
                              message: "At least one ingredient is needed!");
                        }
                        for (Map<String, dynamic> ingredientControler
                            in ingredientsControllersArray) {
                          if (ingredientControler["ingredient"].text.isEmpty) {
                            formAlert(message: "Ingredient name is required");
                            return;
                          }
                          if (ingredientControler["measurements"]
                              .text
                              .isEmpty) {
                            formAlert(
                                message:
                                    "Measurements information is required");
                            return;
                          }
                        }
                        final Map<String, dynamic> newRecipe = {
                          "name": recipeNameController.text,
                          "nutrition_information":
                              nutritionInformationController.text,
                          "instructions":
                              preparationInstructionsController.text,
                          "ingredients": List<Map<String, dynamic>>.from(
                              ingredientsControllersArray
                                  .map((Map<String, dynamic> data) => {
                                        "name": data["ingredient"].text,
                                        "measurements":
                                            data["measurements"].text,
                                      }))
                        };
                        recipesBloc.add(AddRecipe(recipe: newRecipe));
                      },
                      child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 250),
                          child: state is Loading
                              ? const CircularProgressIndicator()
                              : const Text(
                                  'Add Recipe',
                                )),
                    ),
                  );
                },
              )),
        ]),
      ),
    );
  }
}
