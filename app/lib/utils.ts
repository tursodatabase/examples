import axios from "axios";
import type { Organization } from "./types";
import { createClient } from "@libsql/client/http";
import { buildDbClient } from "./client-org";

/**
 *
 * @param dateString Date in YYYY-MM-DD
 * @returns
 */
export function dateToUnixepoch(dateString?: string) {
  if (dateString !== undefined) {
    return Number((Date.parse(dateString) / 1000).toFixed(0));
  }
  return Number((Date.now() / 1000).toFixed(0));
}

export function unixepochToDate(val: number) {
  const newDate = new Date(val * 1000);

  const date = newDate.toLocaleDateString("US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return date;
}

export async function createOrganizationDatabase(organization: Organization) {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
    },
  };

  // create a database for organization
  const orgDatabase = await axios.post(
    `${process.env.TURSO_API_URL}/v1/databases`,
    {
      name: `${process.env.APP_NAME}-${organization.username}`,
      group: `${process.env.APP_NAME}`,
      location: `${process.env.APP_PRIMARY_LOCATION}`,
    },
    config
  );
  const {
    database: { Hostname: dbUrl },
  } = orgDatabase.data;

  // create an authentication token
  const orgToken = await axios.post(
    `${process.env.TURSO_API_URL}/v1/organizations/${process.env.APP_ORGANIZATION}/databases/${process.env.APP_NAME}-${organization.username}/auth/tokens`,
    {},
    config
  );
  const { jwt: authToken } = orgToken.data;

  // run migrations
  const db = createClient({
    url: `libsql://${dbUrl}`,
    authToken,
  });

  const statements = orgSchema.split("--> statement-breakpoint");

  await db.batch(statements);

  return {
    ok: true,
    message: "Organization database created",
    data: {
      url: dbUrl,
      authToken,
    },
  };
}

export async function getConversationDetails(
  conversationId: string,
  org: Organization
) {
  const db = buildDbClient({
    url: `${org.dbUrl}`,
    authToken: `${org.dbToken}`,
  });

  const conversation = await db.query.conversations.findFirst({
    where: (conversations, { eq }) => eq(conversations.id, conversationId),
    with: {
      messages: true,
      agent: true,
      ticket: true,
    },
  });

  return conversation;
}

export async function getCustomerConversationDetails({
  conversationId,
  org,
}: {
  conversationId: string;
  org: Organization;
}) {
  if (conversationId === undefined || org === undefined) {
    return {
      ok: false,
      customer: null,
    };
  }

  const db = buildDbClient({
    url: `${org.dbUrl}`,
    authToken: `${org.dbToken}`,
  });

  const conversation = await db.query.conversations.findFirst({
    where: (conversation, { eq }) => eq(conversation.id, conversationId),
    with: {
      ticket: true,
      messages: true,
      agent: true,
    },
  });

  if (conversation === undefined || conversation?.ticket.isClosed == 1) {
    return {
      ok: false,
      data: null,
    };
  }

  const customer = await db.query.tickets.findFirst({
    where: (tickets, { eq }) => eq(tickets.id, conversation.ticket.id),
  });

  if (customer === undefined) {
    return {
      ok: false,
      data: null,
    };
  }

  return {
    ok: true,
    data: { customer, conversation },
  };
}

const orgSchema = `CREATE TABLE agents (
	id text PRIMARY KEY NOT NULL,
	full_name text NOT NULL,
	email text NOT NULL,
	password text NOT NULL,
	created_at integer DEFAULT (cast(unixepoch() as int)),
	updated_at integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE conversations (
	id text PRIMARY KEY NOT NULL,
	ticket_id text NOT NULL,
	agent_id text NOT NULL,
	created_at integer DEFAULT (cast(unixepoch() as int)) NOT NULL,
	updated_at integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE messages (
	id text PRIMARY KEY NOT NULL,
	sender text NOT NULL,
	message text NOT NULL,
	conversation_id text,
	created_at integer DEFAULT (cast(unixepoch() as int)) NOT NULL,
	updated_at integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE tickets (
	id text PRIMARY KEY NOT NULL,
	customer_email text NOT NULL,
	customer_name text NOT NULL,
	query text,
	is_closed integer DEFAULT 0 NOT NULL,
	service_rating integer,
	created_at integer DEFAULT (cast(unixepoch() as int)) NOT NULL,
	updated_at integer DEFAULT (cast(unixepoch() as int)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX email_idx ON agents (email);`;
