import axios from "axios";
import {
  makeAgent,
  makeConversation,
  makeMessage,
  makeTicket,
  type Organization,
} from "./types";
import { _buildOrgDbClient } from "./client-org";
import { _buildServiceDbClient } from "./client";

// CMS service database access options
export const options = {
  syncUrl: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
};

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

/**
 * @description Constructs local path for tenant db
 * @param url: Turso database URL
 * */
export function tenantDbLocalPath(url: string) {
  return `databases/${(url as string).replace(
    `-${process.env.APP_ORGANIZATION}.turso.io`,
    ".db"
  )}`;
}

/**
 * @description Calculates time diff between two points
 */
export class Delta {
  time: any;

  /**
   * Start counting time
   */
  constructor() {
    this.time = performance.now();
  }

  /**
   * @description Stop counting time
   * @param label Label to accompany time diff output
   */
  stop(label = "Request Delta") {
    console.log(`${label}: ${(performance.now() - this.time).toFixed(3)} ms`);
  }
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
      group: `${process.env.APP_NAME}`, // Todo: Use group name e.g (process.env.APP_NAME) if you're on the scaler/entreprize plans and are using groups
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
  const db = _buildOrgDbClient({ url: dbUrl });

  await db.exec(orgSchema);

  await db.sync();

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
  const db = _buildOrgDbClient({
    url: `${org.dbUrl}`,
  });

  const conversation = await db
    .prepare(
      'select "id", "ticket_id", "agent_id", "created_at", "updated_at", (select coalesce(json_group_array(json_array("id", "sender", "message", "conversation_id", "created_at", "updated_at")), json_array()) as "data" from "messages" "conversations_messages" where "conversations_messages"."conversation_id" = "conversations"."id") as "messages", (select json_array("id", "full_name", "email", "password", "created_at", "updated_at") as "data" from (select * from "agents" "conversations_agent" where "conversations_agent"."id" = "conversations"."agent_id" limit ?) "conversations_agent") as "agent", (select json_array("id", "customer_email", "customer_name", "query", "is_closed", "service_rating", "created_at", "updated_at") as "data" from (select * from "tickets" "conversations_ticket" where "conversations_ticket"."id" = "conversations"."ticket_id" limit ?) "conversations_ticket") as "ticket" from "conversations" where "conversations"."id" = ? limit ?'
    )
    .get([1, conversationId, 1]);

  const { messages, agent, ticket, ...conversationDetails } = conversation;

  return {
    ...makeConversation(conversationDetails),
    messages:
      messages.length > 0
        ? messages.map((message: any) => makeMessage(message))
        : [],
    agent: makeAgent(agent),
    ticket: makeTicket(ticket),
  };
}

export async function getAllOrganizations() {
  const db = _buildServiceDbClient();

  const time = new Delta();
  const organizations = await db.prepare("SELECT * FROM organizations").all();
  time.stop();

  return organizations !== undefined
    ? organizations.map((org: any) => ({ ...org, dbUrl: org.db_url }))
    : [];
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

  const db = _buildOrgDbClient({
    url: `${org.dbUrl}`,
  });

  const conversation = await db
    .prepare(
      'select "id", "ticket_id", "agent_id", "created_at", "updated_at", (select json_array("id", "customer_email", "customer_name", "query", "is_closed", "service_rating", "created_at", "updated_at") as "data" from (select * from "tickets" "conversations_ticket" where "conversations_ticket"."id" = "conversations"."ticket_id" limit ?) "conversations_ticket") as "ticket", (select coalesce(json_group_array(json_array("id", "sender", "message", "conversation_id", "created_at", "updated_at")), json_array()) as "data" from "messages" "conversations_messages" where "conversations_messages"."conversation_id" = "conversations"."id") as "messages", (select json_array("id", "full_name", "email", "password", "created_at", "updated_at") as "data" from (select * from "agents" "conversations_agent" where "conversations_agent"."id" = "conversations"."agent_id" limit ?) "conversations_agent") as "agent" from "conversations" where "conversations"."id" = ? limit ?'
    )
    .get([1, conversationId, 1]);

  if (conversation === undefined || conversation?.ticket.is_closed == 1) {
    return {
      ok: false,
      data: null,
    };
  }

  const customer = await db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(conversation.ticket.id);

  if (customer === undefined) {
    return {
      ok: false,
      data: null,
    };
  }

  return {
    ok: true,
    data: {
      customer: makeTicket(customer),
      conversation: makeConversation(conversation),
    },
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
