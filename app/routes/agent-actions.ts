import { type ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { buildDbClient } from "~/lib/client";
import { buildDbClient as buildOrgDbClient } from "~/lib/client-org";
import {
  destroyAgentAuthSession,
  requireAgentId,
} from "~/lib/agent-session.server";
import { v4 as uuidv4 } from "uuid";
import { conversations, tickets } from "drizzle/org-schema";
import { dateToUnixepoch } from "~/lib/utils";
import { eq } from "drizzle-orm";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const db = buildDbClient();

  // get organization
  const currentOrganization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) =>
      eq(organizations.id, values.organization_id as string),
  });

  if (currentOrganization === undefined) {
    return redirect(`/`); // org not exists
  }

  // get auth session
  const agentId = await requireAgentId({
    request,
    redirectTo: `/agent/${currentOrganization.username}/login`,
  });

  if (agentId === undefined) {
    return redirect(`/agent/${currentOrganization.username}/login`);
  }

  const orgDb = buildOrgDbClient({
    url: currentOrganization.dbUrl as string,
  });

  const currentAgent = await orgDb.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.id, agentId),
  });

  if (currentAgent === undefined) {
    return redirect(`/agent/${currentOrganization.username}/login`);
  }

  if (_action === "logOut") {
    const agentId = await requireAgentId({
      request,
      redirectTo: `/agent/${currentOrganization.username}/login`,
    });
    if (agentId !== undefined) {
      return destroyAgentAuthSession(
        `/agent/${currentOrganization.username}/login`
      );
    }
  }

  if (_action === "startConversation") {
    const { ticket_id } = values as unknown as {
      ticket_id: string;
    };

    const id = uuidv4();

    const ticket = orgDb.query.tickets.findFirst({
      where: (tickets, { eq }) => eq(tickets.id, ticket_id),
    });

    if (ticket === undefined) {
      return json(
        {
          ok: false,
          message: "Ticket not found",
        },
        { status: 204, statusText: "Unknown ticket" }
      );
    }

    const conversationInfo = {
      id,
      ticketId: ticket_id,
      agentId,
    };

    //* start conversation
    const newConversation = await orgDb
      .insert(conversations)
      .values(conversationInfo)
      .returning()
      .get();

    if (newConversation === undefined) {
      return json(
        {
          ok: true,
          message: "Something broke",
        },
        { status: 204, statusText: "Failed to start conversation" }
      );
    }

    // TODO: Send email to customer asking them to engage the company

    return redirect(
      `/agent/${currentOrganization.username}/talk/${newConversation.id}`
    );
  }

  if (_action === "closeTicket") {
    const { ticket_id } = values as unknown as {
      ticket_id: string;
    };

    const ticket = orgDb.query.tickets.findFirst({
      where: (tickets, { eq }) => eq(tickets.id, ticket_id),
    });

    if (ticket === undefined) {
      return json(
        {
          ok: false,
          message: "Ticket not found",
        },
        { status: 204, statusText: "Unknown ticket" }
      );
    }

    const updateInfo = {
      isClosed: 1,
      updatedAt: dateToUnixepoch(),
    };

    //* close ticket
    await orgDb
      .update(tickets)
      .set(updateInfo)
      .where(eq(tickets.id, ticket_id))
      .run();

    return redirect(`/agent/${currentOrganization.username}/dash`);
  }
}
