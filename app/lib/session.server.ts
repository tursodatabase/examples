import { organizations } from "./../../drizzle/schema";
import { redirect } from "@vercel/remix";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { commitOrgSession, destroyOrgSession, getOrgSession } from "~/session";
import { buildDbClient } from "./client";

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
  const db = buildDbClient();

  const organization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.email, email),
  });

  if (organization !== undefined) {
    const isValidPassword = bcrypt.compareSync(
      password,
      (organization.password as string) || ""
    );

    return !isValidPassword ? null : organization;
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

  const db = buildDbClient();

  const existingOrganization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.email, email),
  });

  if (existingOrganization !== undefined) {
    return {
      ok: false,
      message: "An organization with this email already exists",
      organization: null,
    };
  }

  const newUuid = uuidv4();
  const organizationPassword = await bcrypt.hash(password, 10);
  const organizationRecord = await db
    .insert(organizations)
    .values({
      id: newUuid,
      name,
      email,
      username,
      website,
      password: organizationPassword,
      logo,
    })
    .returning()
    .get();

  if (organizationRecord !== undefined) {
    return {
      ok: true,
      message: "Account created",
      organization: organizationRecord,
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
  const db = buildDbClient();

  if (organizationId === undefined && organizationUsername === undefined) {
    return undefined;
  }

  let existingOrganization;

  if (organizationId !== undefined) {
    existingOrganization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, organizationId),
    });
  } else if (organizationUsername !== undefined) {
    existingOrganization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) =>
        eq(organizations.username, organizationUsername),
    });
  }

  return existingOrganization;
}
