import { type ActionFunctionArgs, json } from "@vercel/remix";
import { buildDbClient } from "~/lib/client";
import { buildDbClient as buildOrgDbClient } from "~/lib/client-org";
import { v4 as uuidv4 } from "uuid";
import { tickets } from "drizzle/org-schema";
import { dateToUnixepoch } from "~/lib/utils";
import { eq } from "drizzle-orm";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const db = buildDbClient();

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

  if (_action === "openTicket") {
    const { customer_email, customer_name, query } = values as unknown as {
      customer_email: string;
      customer_name: string;
      query: string;
    };

    const id = uuidv4();
    const ticketInformation = {
      id,
      customerEmail: customer_email,
      customerName: customer_name,
      query,
    };

    //* add agent to db
    const openedTicket = await manageOrgDbs
      .insert(tickets)
      .values(ticketInformation)
      .run();

    if (openedTicket === undefined) {
      return json(
        {
          ok: true,
          message: "Something broke",
        },
        { status: 204, statusText: "Failed to create ticket" }
      );
    }

    // TODO: Send email to organization with ticket details

    return json(
      {
        ok: true,
        message:
          "Ticket opened, you will get a response in your email with further instructions",
      },
      { status: 201, statusText: "Ticket created" }
    );
  }

  if (_action === "rateConversation") {
    const { ticket_id, rating } = values as unknown as {
      ticket_id: string;
      rating: number;
    };

    if (ticket_id === "" || ticket_id === undefined || rating === undefined) {
      return json(
        {
          ok: false,
          message: "Missing credentials",
        },
        { status: 422, statusText: "Missing credentials" }
      );
    }

    const udpateTicket = await manageOrgDbs
      .update(tickets)
      .set({
        serviceRating: rating,
        updatedAt: dateToUnixepoch(),
      })
      .where(eq(tickets.id, ticket_id))
      .run();

    if (udpateTicket === undefined) {
      return json(
        {
          ok: true,
          message: "Something broke",
        },
        { status: 204, statusText: "Failed to rate ticket" }
      );
    }

    return json(
      { ok: true, message: "Ticket rated" },
      { status: 201, statusText: "Ticket rated" }
    );
  }
}
