import { redirect } from "@vercel/remix";
import bcrypt from "bcryptjs";

import {
  commitAgentSession,
  destroyAgentSession,
  getAgentSession,
} from "~/session";
import { buildDbClient as buildOrgDbClient } from "./client-org";
import type { Organization } from "./types";

export interface RegistrationData {
  name: string;
  email: string;
  username: string;
  website: string;
  password: string;
  logo?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function agentLogin({
  email,
  password,
  organization,
}: LoginCredentials & { organization: Organization }) {
  const db = buildOrgDbClient({
    url: organization.dbUrl as string,
  });

  const agent = await db.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.email, email),
  });

  if (agent !== undefined) {
    const isValidPassword = bcrypt.compareSync(
      password,
      (agent.password as string) || ""
    );

    return !isValidPassword ? null : agent;
  }

  return null;
}

export async function createAgentSession(agentId: string, redirectUrl: string) {
  const session = await getAgentSession();
  session.set("agentId", agentId);

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitAgentSession(session),
    },
  });
}

export async function destroyAgentAuthSession(redirectUrl: string) {
  const session = await getAgentSession();

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await destroyAgentSession(session),
    },
  });
}

// Gets agent ID from auth session
export async function requireAgentId({
  request,
  redirectTo = new URL(request.url).pathname,
}: {
  request: Request;
  redirectTo?: string;
}) {
  const session = await getAgentSession(request.headers.get("Cookie"));
  const agentId = session.get("agentId");

  if (agentId === undefined) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    redirect(`${redirectTo}?${searchParams}`);
  }

  // TODO: Destroy session if account doesn't exist and return null

  return agentId;
}

export async function getAgentDetails({
  agentId,
  org,
}: {
  agentId: string;
  org: Organization;
}) {
  if (agentId === undefined || org === undefined) {
    return {
      ok: false,
      organization: null,
    };
  }

  const db = buildOrgDbClient({
    url: `${org.dbUrl}`,
  });

  const existingAgent = await db.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.id, agentId),
  });

  if (existingAgent === undefined) {
    return {
      ok: false,
      agent: null,
    };
  }

  return {
    ok: true,
    agent: existingAgent,
  };
}
