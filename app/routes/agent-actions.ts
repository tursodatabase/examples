import { type ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { _buildServiceDbClient } from "~/lib/client";
import { _buildOrgDbClient } from "~/lib/client-org";
import {
  destroyAgentAuthSession,
  requireAgentId,
} from "~/lib/agent-session.server";
import { v4 as uuidv4 } from "uuid";
import { Delta, dateToUnixepoch } from "~/lib/utils";
import { makeOrganization } from "~/lib/types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const db = _buildServiceDbClient();

  // get organization
  const t0 = new Delta();
  const currentOrganization = await db
    .prepare("SELECT * FROM organizations WHERE id = ?")
    .get(values.organization_id);
  t0.stop("Fetching organization details");

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

  const orgDb = _buildOrgDbClient({
    url: makeOrganization(currentOrganization).dbUrl as string,
  });

  const t1 = new Delta();
  const currentAgent = await orgDb
    .prepare("SELECT * FROM agents WHERE id = ?")
    .get(agentId);
  t1.stop("Fetching a single agent");

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

    const t0 = new Delta();
    const ticket = await orgDb
      .prepare("SELECT * FROM tickets WHERE id = ?")
      .get(ticket_id);
    t0.stop("Fetching a single ticket");

    if (ticket === undefined) {
      return json(
        {
          ok: false,
          message: "Ticket not found",
        },
        { status: 204, statusText: "Unknown ticket" }
      );
    }

    const id = uuidv4();
    const conversationInfo = [id, ticket_id, agentId];

    //* start conversation
    const t1 = new Delta();
    await orgDb
      .prepare(
        "INSERT INTO conversations(id, ticket_id, agent_id) values(?, ?, ?)"
      )
      .run(conversationInfo);
    t1.stop("Creating a new conversation");

    const t2 = new Delta();
    await orgDb.sync();
    t2.stop("Syncronizing conversations");

    const t3 = new Delta();
    const newConversation = await orgDb
      .prepare("SELECT * FROM conversations WHERE id = ?")
      .get(id);
    t3.stop("Fetching created conversation");
    console.log(
      { newConversation, id },
      `SELECT * FROM conversations WHERE id = ${id}`
    );

    if (newConversation === undefined) {
      console.log("Failed to start a conversation;");
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

    const t0 = new Delta();
    const ticket = await orgDb
      .prepare("SELECT * FROM tickets WHERE id = ?")
      .get(ticket_id);
    t0.stop("Fetching a single ticket");

    if (ticket === undefined) {
      return json(
        {
          ok: false,
          message: "Ticket not found",
        },
        { status: 204, statusText: "Unknown ticket" }
      );
    }

    const updateTime = dateToUnixepoch();
    const updateInfo = [1, updateTime, ticket_id];

    //* close ticket
    const t1 = new Delta();
    await orgDb
      .prepare("UPDATE tickets SET is_closed = ?, updated_at = ? WHERE id = ?")
      .run(updateInfo);
    t1.stop("Closing ticket");

    await orgDb.sync();

    return redirect(`/agent/${currentOrganization.username}/dash`);
  }
}
