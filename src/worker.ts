import { createClient } from '@libsql/client/http';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { v4 as uuidv4 } from 'uuid';

import {
  error,
  IRequest,
  json,
  Router,
  RouterType,
  withParams,
} from 'itty-router';
import {
  categories,
  insertCategorySchema,
  insertMugsSchema,
  mugs,
} from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export interface Env {
  TURSO_DB_AUTH_TOKEN?: string;
  TURSO_DB_URL?: string;
  router?: RouterType;
}

function buildDbClient(env: Env): LibSQLDatabase {
  const url = env.TURSO_DB_URL?.trim();
  if (url === undefined) {
    throw new Error('TURSO_DB_URL is not defined');
  }

  const authToken = env.TURSO_DB_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
  }

  return drizzle(createClient({ url, authToken }));
}

function buildIttyRouter(env: Env): RouterType {
  const router = Router();
  const db = buildDbClient(env);

  // TODO: Add basic authentication

  router
    // add some middleware upstream on all routes
    .all('*', withParams)

    .get('/mugs', async () => {
      const mugsData = await db.select().from(mugs).all();

      return json({
        mugs: mugsData,
      });
    })

    .get('/mug/:id', async ({ id }) => {
      const mugData = await db.select().from(mugs).where(eq(mugs.id, id)).get();

      return mugData
        ? json({
            mug: mugData,
          })
        : error(404, 'Mug not found!');
    })

    .post('/mug', async (request: IRequest) => {
      let {
        category_id,
        ...jsonData
      }: {
        name: string;
        description: string;
        price: number;
        category_id: string;
        image?: string;
      } = await request.json();
      const mugData = insertMugsSchema.parse({
        id: uuidv4(),
        categoryId: category_id,
        ...(jsonData as object),
      });
      if (!mugData) {
        return error(422, 'Required data is missing!');
      }

      const newMug = await db.insert(mugs).values(mugData).returning().get();

      return json(
        { mug: newMug },
        {
          status: 201,
        },
      );
    })

    .patch('/mug/:id', async (request) => {
      let { id } = request.params;
      if (!id) {
        return error(422, 'ID is required');
      }
      let jsonData: {
        name?: string;
        description?: string;
        price?: number;
        category_id?: string;
        image?: string;
      } = await request.json();
      let updatedMugData;

      if (!Object.keys(jsonData).length) {
        updatedMugData = await db
          .select()
          .from(mugs)
          .where(eq(mugs.id, id))
          .get();
        return updatedMugData
          ? json({ mug: updatedMugData })
          : error(404, 'Mug not found!');
      }

      updatedMugData = await db
        .update(mugs)
        .set({ updatedAt: Number((Date.now() / 1000).toFixed(0)), ...jsonData })
        .where(eq(mugs.id, id))
        .returning()
        .get();

      return json({ mug: updatedMugData });
    })

    .delete('/mug/:id', async ({ id }) => {
      if (!id) {
        return error(422, 'ID is required');
      }
      const mugData = await db
        .delete(mugs)
        .where(eq(mugs.id, id))
        .returning()
        .get();
      return json({
        mug: mugData,
      });
    })

    .get('/categories', async () => {
      const categoryData = await db.select().from(categories).all();
      return json({
        categories: categoryData,
      });
    })

    .get('/category/:id', async ({ id }) => {
      const categoryData = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .get();
      return categoryData
        ? json({
            category: categoryData,
          })
        : error(404, 'Category not found!');
    })

    .post('/category', async (request: IRequest) => {
      let jsonData = await request.json();
      const categoryData = insertCategorySchema.parse({
        id: uuidv4(),
        ...(jsonData as object),
      });
      if (!categoryData) {
        return error(422, 'Required data is missing!');
      }

      const newCategory = await db
        .insert(categories)
        .values(categoryData)
        .returning()
        .get();

      return json(
        { category: newCategory },
        {
          status: 201,
        },
      );
    })

    .patch('/category/:id', async (request) => {
      let { id } = request.params;
      if (!id) {
        return error(422, 'ID is required');
      }

      let jsonData: { name: string } = await request.json();
      let updatedCategoryData;

      if (!Object.keys(jsonData).length) {
        updatedCategoryData = await db
          .select()
          .from(categories)
          .where(eq(categories.id, id))
          .get();
        return updatedCategoryData
          ? json({ category: updatedCategoryData })
          : error(404, 'Category not found!');
      }

      updatedCategoryData = await db
        .update(categories)
        .set(jsonData)
        .where(eq(categories.id, id))
        .returning()
        .get();

      return json({ mug: updatedCategoryData });
    })

    .delete('/category/:id', async ({ id }) => {
      if (!id) {
        return error(422, 'ID is required');
      }
      const categoryData = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning()
        .get();
      return categoryData
        ? json({
            category: categoryData,
          })
        : error(404, 'Category not found!');
    })

    .all('*', () => error(404));

  return router;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (env.router === undefined) {
      env.router = buildIttyRouter(env);
    }
    return env.router?.handle(request);
  },
};
