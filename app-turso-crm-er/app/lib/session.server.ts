import { Delta } from "~/lib/utils";
import { redirect } from "@vercel/remix";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { commitOrgSession, destroyOrgSession, getOrgSession } from "~/session";
import { makeOrganization } from "./types";
import { _buildServiceDbClient } from "./client";

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

export async function login({ email, password }: LoginCredentials) {
  const db = _buildServiceDbClient();

  const t0 = new Delta();
  const organization = await db
    .prepare("SELECT * FROM organizations WHERE email = ?")
    .get(email);
  t0.stop("Fetching a single organization");

  if (organization !== undefined) {
    const isValidPassword = bcrypt.compareSync(
      password,
      (organization.password as string) || ""
    );

    return !isValidPassword
      ? null
      : { ...organization, dbUrl: organization.db_url };
  }

  return null;
}

export async function register({
  name,
  email,
  username,
  website,
  password,
  logo,
}: RegistrationData) {
  // validate
  if (
    name === undefined ||
    email === undefined ||
    username === undefined ||
    website === undefined ||
    password === undefined
  ) {
    return {
      message: "missing credentials",
      organization: null,
    };
  }

  const db = _buildServiceDbClient();

  const t1 = new Delta();
  const existingOrganization = await db
    .prepare("SELECT * FROM organizations WHERE email = ?")
    .get(email);
  t1.stop("Fetching a single organization");

  if (existingOrganization !== undefined) {
    return {
      ok: false,
      message: "An organization with this email already exists",
      organization: null,
    };
  }

  const newUuid = uuidv4();
  const organizationPassword = await bcrypt.hash(password, 10);

  const newOrg = [
    newUuid,
    name,
    website,
    username,
    email,
    organizationPassword,
    logo,
  ];

  const time = new Delta();
  await db
    .prepare(
      "INSERT INTO organizations(id, name, website, username, email, password, logo) values(?, ?, ?, ?, ?, ?, ?)"
    )
    .run(newOrg);
  time.stop("Creating a new organization");

  await db.sync();

  const t2 = new Delta();
  const organizationRecord = await db
    .prepare("SELECT * FROM organizations WHERE id = ?")
    .get(newUuid);
  t2.stop("Fetching created organization");

  if (organizationRecord !== undefined) {
    return {
      ok: true,
      message: "Account created",
      organization: makeOrganization(organizationRecord),
    };
  }

  return {
    message: "Unknown error",
    organization: null,
  };
}

export async function createOrganizationSession(
  orgId: string,
  redirectUrl: string
) {
  const session = await getOrgSession();
  session.set("orgId", orgId);

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitOrgSession(session),
    },
  });
}

export async function destroyOrganizationSession(redirectUrl: string) {
  const session = await getOrgSession();

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await destroyOrgSession(session),
    },
  });
}

// Gets organization ID from auth session
export async function requireOrganizationId({
  request,
  redirectTo = new URL(request.url).pathname,
}: {
  request: Request;
  redirectTo?: string;
}) {
  const session = await getOrgSession(request.headers.get("Cookie"));
  const orgId = session.get("orgId");

  if (orgId === undefined) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    redirect(`${redirectTo}?${searchParams}`);
  }

  return orgId;
}

export async function getOrganizationDetails({
  organizationId,
  organizationUsername,
}: {
  organizationId?: string;
  organizationUsername?: string;
}) {
  const db = _buildServiceDbClient();

  if (organizationId === undefined && organizationUsername === undefined) {
    return undefined;
  }

  let existingOrganization;

  if (organizationId !== undefined) {
    const existingOrganization = await db
      .prepare("SELECT * FROM organizations WHERE id = ?")
      .get(organizationId);
    return existingOrganization !== undefined
      ? makeOrganization(existingOrganization)
      : undefined;
  } else if (organizationUsername !== undefined) {
    const existingOrganization = await db
      .prepare("SELECT * FROM organizations WHERE username = ?")
      .get(organizationUsername);
    return existingOrganization !== undefined
      ? makeOrganization(existingOrganization)
      : undefined;
  }

  return existingOrganization !== undefined
    ? makeOrganization(existingOrganization)
    : undefined;
}
