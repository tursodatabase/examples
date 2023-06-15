import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name'),
  },
  (categories) => ({
    nameIdx: uniqueIndex('name_idx').on(categories.name),
  }),
);
export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const mugs = sqliteTable(
  'mugs',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    image: text('image'),
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
  },
  (mugs) => ({
    idIdx: uniqueIndex('mug_id_idx').on(mugs.id),
    nameIdx: index('mug_name_idx').on(mugs.name),
    descriptionIdx: index('mug_description_idx').on(mugs.description),
    priceIdx: index('mug_price_idx').on(mugs.price),
    categoryIdIdx: index('mug_category_id_idx').on(mugs.categoryId),
  }),
);
export const insertMugsSchema = createInsertSchema(mugs);
export const selectMugsSchema = createSelectSchema(mugs);

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('firstName').notNull(),
    email: text('email').notNull(),
    avatar: text('avatar'),
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
  },
  (users) => ({
    emailIdx: uniqueIndex('user_email_idx').on(users.email),
  }),
);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const passwords = sqliteTable(
  'passwords',
  {
    hash: text('hash').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
  },
  (passwords) => ({
    userIdx: uniqueIndex('user_id_idx').on(passwords.userId),
  }),
);
export const insertPasswordSchema = createInsertSchema(passwords);
export const selectPasswordSchema = createSelectSchema(passwords);
