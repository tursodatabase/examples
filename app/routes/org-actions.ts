import { type ActionFunctionArgs, json, redirect } from "@vercel/remix";
import bcrypt from "bcryptjs";
import { buildDbClient } from "~/lib/client";
import { buildDbClient as buildOrgDbClient } from "~/lib/client-org";
import {
  destroyOrganizationSession,
  requireOrganizationId,
} from "~/lib/session.server";
import { v4 as uuidv4 } from "uuid";
import type { Agent } from "~/lib/types";
import { agents } from "drizzle/org-schema";
import { dateToUnixepoch } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const db = buildDbClient();

  const organizationId = await requireOrganizationId({
    request,
    redirectTo: "/login",
  });

  if (organizationId === undefined) {
    return redirect("/login");
  }

  // get organization
  const currentOrganization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.id, organizationId),
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

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "onboardAgent") {
    const { full_name, email } = values as unknown as {
      full_name: string;
      email: string;
    };
    const id = uuidv4();
    const password = uuidv4().split("-")[0];
    const hash = await bcrypt.hash(password, 10);
    const agentInformation: Agent = {
      id,
      fullName: full_name,
      email,
      password: hash,
      createdAt: dateToUnixepoch(),
      updatedAt: dateToUnixepoch(),
    };

    //* add agent to db
    const agentAdded = await manageOrgDbs
      .insert(agents)
      .values(agentInformation)
      .run();

    if (agentAdded === undefined) {
      return json(
        {
          ok: true,
          message: "Something broke",
          information: { email, password },
        },
        { status: 204, statusText: "Failed to onboard agent" }
      );
    }

    // TODO: Send credentials to agent's email

    return json(
      { ok: true, message: "Agent added", data: { email, password } },
      { status: 201, statusText: "Agent added" }
    );
  }

  if (_action === "logOut") {
    const agentId = await requireOrganizationId({
      request,
      redirectTo: `/agent/${currentOrganization.username}/login`,
    });
    if (agentId !== undefined) {
      return destroyOrganizationSession(`/login`);
    }
  }
}
