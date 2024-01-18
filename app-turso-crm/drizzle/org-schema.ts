import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const agents = sqliteTable(
  "agents",
  {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
  },
  (agents) => ({
    emailIdx: uniqueIndex("email_idx").on(agents.email),
  })
);

export const agentsRelations = relations(agents, ({ many }) => ({
  conversations: many(conversations),
}));

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  query: text("query"),
  isClosed: integer("is_closed").default(0).notNull(),
  serviceRating: integer("service_rating"),
  createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
  updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
  conversation: one(conversations, {
    fields: [tickets.id],
    references: [conversations.ticketId],
  }),
}));

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull(),
  agentId: text("agent_id").notNull(),
  createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
  updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
});

export const conversationsRelations = relations(
  conversations,
  ({ many, one }) => ({
    ticket: one(tickets, {
      fields: [conversations.ticketId],
      references: [tickets.id],
    }),
    agent: one(agents, {
      fields: [conversations.agentId],
      references: [agents.id],
    }),
    messages: many(messages),
  })
);

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  sender: text("sender").notNull(), // agent | customer
  message: text("message").notNull(),
  conversationId: text("conversation_id"),
  createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
  updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
