import { passwords, users } from "./../../drizzle/schema";
import { AppLoadContext, redirect } from "@remix-run/cloudflare";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { cookieSessionCreation } from "~/sessions";
import { buildDbClient } from "./client";
import { User } from "./types";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address?: string | null;
  avatar?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(
  { email, password }: LoginCredentials,
  serverContext: AppLoadContext
) {
  const db = buildDbClient(serverContext);
  // check if email exists
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    with: {
      password: true,
    },
  });

  if (user !== undefined) {
    const isValidPassword = bcrypt.compareSync(
      password,
      user.password.hash as string
    );

    return !isValidPassword ? null : user;
  }

  return null;
}

export async function register(
  {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    avatar,
  }: RegistrationData,
  serverContext: any
) {
  // validate
  if (!firstName || !lastName || !email || !password || !phone) {
    return {
      message: "missing credentials",
      user: null,
    };
  }

  const db = buildDbClient(serverContext);

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser !== undefined) {
    return {
      message: "An account with this email already exists",
      user: null,
    };
  }

  const newUuid = uuidv4();
  await db
    .insert(users)
    .values({
      id: newUuid,
      firstName,
      lastName,
      email,
      phone,
    })
    .returning()
    .get();

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (userRecord !== undefined) {
    // create password record
    const userPassword = await bcrypt.hash(password, 10);
    await db
      .insert(passwords)
      .values({ hash: userPassword, userId: userRecord.id })
      .returning()
      .get();
    return {
      message: "Account created",
      user: userRecord as unknown as User,
    };
  }
  return {
    message: "Unknown error",
    user: null,
  };
}

export async function createUserSession(
  userId: string,
  redirectUrl: string,
  serverContext: AppLoadContext
) {
  const { getSession, commitSession } = cookieSessionCreation(serverContext);
  const session = await getSession();
  session.set("userId", userId);

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function destroyUserSession(
  userId: string,
  redirectUrl: string,
  serverContext: any
) {
  const { getSession, destroySession } = cookieSessionCreation(serverContext);
  const session = await getSession();

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function requireUserId(
  {
    request,
    redirectTo = new URL(request.url).pathname,
  }: {
    request: Request;
    redirectTo?: string;
  },
  serverContext: AppLoadContext
) {
  const { getSession } = cookieSessionCreation(serverContext);
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    redirect(`/account/login?${searchParams}`);
  }
  return userId;
}
