import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createClient } from '@libsql/client';
import { v4 as uuidV4 } from 'uuid';
import { Ingredient, Recipe } from 'src/components/models';

const PORT = 3000;

const db = createClient({
  url: 'file:recipe-book.db',
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/recipes', async (req, res) => {
  const results = await db.execute(
    "select recipes.id, recipes.name, recipes.nutrition_information as nutritionInformation, recipes.instructions, recipes.created_at as createdAt, recipes.updated_at as updatedAt, json_group_array(json_object('id', ingredients.id, 'name', ingredients.name, 'measurements', ingredients.measurements)) as ingredients from recipes join ingredients on ingredients.recipe_id = recipes.id group by recipes.id"
  );

  res.json({ recipes: results.rows });
});

app.post('/recipe', async (req, res) => {
  const { recipe, ingredients } = (await req.body) as unknown as {
    recipe: Recipe;
    ingredients: Ingredient[];
  };
  const recipeId = uuidV4();
  await db.execute({
    sql: 'insert into recipes(id, name, nutrition_information, instructions) values (?, ?, ?, ?)',
    args: [
      recipeId,
      recipe.name,
      recipe.nutritionInformation as string,
      recipe.instructions as string,
    ],
  });

  const statements = ingredients?.map((ingredient) => ({
    sql: 'insert into ingredients(id, name, measurements, recipe_id) values (?, ?, ?, ?)',
    args: [uuidV4(), ingredient.name, ingredient.measurements, recipeId],
  }));
  await db.batch(statements, 'write');

  res.json({ ok: true });
});

app.delete('/recipe/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute({
    sql: 'delete from ingredients where recipe_id = ?',
    args: [id],
  });

  await db.execute({
    sql: 'delete from recipes where id = ?',
    args: [id],
  });

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`App running at port ${PORT}`));
