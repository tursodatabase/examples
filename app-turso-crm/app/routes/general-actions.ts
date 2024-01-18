import { type ActionFunctionArgs, json } from "@vercel/remix";
import { buildDbClient } from "~/lib/client";
import { buildDbClient as buildOrgDbClient } from "~/lib/client-org";
import { v4 as uuidv4 } from "uuid";
import { messages } from "drizzle/org-schema";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const db = buildDbClient();

  if (values.organization_username === undefined) {
    return json(
      { ok: false, message: "Organization username not found" },
      { status: 422, statusText: "Unknown organization!" }
    );
  }

  // get organization
  const currentOrganization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) =>
      eq(organizations.username, values.organization_username as string),
  });

  if (currentOrganization === undefined) {
    return json(
      { ok: false, message: "Organization not found" },
      { status: 422, statusText: "Could not fetch organization's information!" }
    );
  }

  const manageOrgDbs = buildOrgDbClient({
    url: currentOrganization.dbUrl as string,
  });

  if (_action === "sendMessage") {
    const { sender, conversation_id, message } = values as unknown as {
      sender: "agent" | "customer";
      conversation_id: string;
      message: string;
    };

    const id = uuidv4();
    const messageInformation = {
      id,
      sender,
      message,
      conversationId: conversation_id,
    };

    //* submit a message
    const messageSubmitted = await manageOrgDbs
      .insert(messages)
      .values(messageInformation)
      .run();

    if (messageSubmitted === undefined) {
      return json(
        {
          ok: true,
          message: "Something broke",
        },
        { status: 204, statusText: "Failed to submit message" }
      );
    }

    return json(
      { ok: true, message: "Message submitted" },
      { status: 201, statusText: "Message submitted" }
    );
  }
}
