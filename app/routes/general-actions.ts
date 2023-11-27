import { type ActionFunctionArgs, json } from "@vercel/remix";
import { _buildServiceDbClient } from "~/lib/client";
import { _buildOrgDbClient } from "~/lib/client-org";
import { v4 as uuidv4 } from "uuid";
import { Delta, dateToUnixepoch } from "~/lib/utils";
import { makeOrganization } from "~/lib/types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const db = _buildServiceDbClient();

  if (values.organization_username === undefined) {
    return json(
      { ok: false, message: "Organization username not found" },
      { status: 422, statusText: "Unknown organization!" }
    );
  }

  // get organization
  const t0 = new Delta();
  const currentOrganization = await db
    .prepare("SELECT * FROM organizations WHERE username = ?")
    .get(values.organization_username);
  t0.stop("Fetching single organization");

  if (currentOrganization === undefined) {
    return json(
      { ok: false, message: "Organization not found" },
      { status: 422, statusText: "Could not fetch organization's information!" }
    );
  }

  const manageOrgDbs = _buildOrgDbClient({
    url: makeOrganization(currentOrganization).dbUrl as string,
  });

  if (_action === "sendMessage") {
    const { sender, conversation_id, message } = values as unknown as {
      sender: "agent" | "customer";
      conversation_id: string;
      message: string;
    };

    const id = uuidv4();
    const currentTime = dateToUnixepoch();
    const messageInformation = [
      id,
      sender,
      message,
      conversation_id,
      currentTime,
      currentTime,
    ];

    //* submit a message
    const t1 = new Delta();
    await manageOrgDbs
      .prepare(
        "INSERT INTO messages(id, sender, message, conversation_id, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)"
      )
      .run(messageInformation);
    t1.stop("Creating a new message");

    const t2 = new Delta();
    const messageSubmitted = await manageOrgDbs
      .prepare("SELECT * FROM messages WHERE id = ?")
      .get(id);
    t2.stop("Fetching created message");

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
