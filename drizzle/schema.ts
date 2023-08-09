import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    image: text("image"),
  },
  (categories) => ({
    nameIdx: index("name_idx").on(categories.name),
  })
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: real("price").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    image: text("image"),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (products) => ({
    idIdx: uniqueIndex("id_idx").on(products.id),
    priceIdx: index("price_idx").on(products.price),
    categoryIdIdx: index("category_id_idx").on(products.categoryId),
  })
);

export const productsRelations = relations(products, ({ one }) => ({
  user: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull(),
    address: text("address"),
    phone: text("phone"),
    avatar: text("avatar"),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (users) => ({
    emailIdx: uniqueIndex("email_idx").on(users.email),
    firstNameLastNameAddressIdx: index("first_name_last_name_address_idx").on(
      users.firstName,
      users.lastName,
      users.address
    ),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.userId],
  }),
  cartItems: many(cartItems),
  orders: many(orders),
}));

export const passwords = sqliteTable("passwords", {
  hash: text("hash").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
}));

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    count: integer("count").notNull().default(1),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (cartItems) => ({
    userIdProductIdx: uniqueIndex("cart_items_user_id_product_id_idx").on(
      cartItems.id
    ),
    productIdx: index("cart_items_product_id_idx").on(cartItems.productId),
  })
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  amount: real("amount").notNull(),
  shippingFees: real("shipping_fees").notNull(),
  discountAmt: integer("discount_amt").notNull().default(0),
  finalAmount: integer("final_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paid: integer("paid").notNull().default(0),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    count: integer("count").notNull().default(1),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer("updated_at").default(sql`(cast (unixepoch () as int))`),
  },
  (orderItems) => ({
    orderIdProductIdIdx: uniqueIndex("order_items_order_id_product_id_idx").on(
      orderItems.orderId,
      orderItems.productId
    ),
    productIdx: index("order_items_product_id_idx").on(orderItems.productId),
  })
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
