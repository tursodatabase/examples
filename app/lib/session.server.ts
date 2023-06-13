import bcrypt from "bcryptjs";
import { redirect } from "@remix-run/cloudflare";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

import { cartItems, passwords, users } from "drizzle/schema";
import {
  commitSession,
  commitTempSession,
  destroyTempSession,
  getSession,
  getTempSession,
} from "~/sessions";

import { db } from "./client";
import type { User } from "./types";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address?: string | null;
  avatar?: string | null;
}

export async function login(email: string, password: string) {
  // check if email exists
  const user: any = await db
    .select()
    .from(users)
    .leftJoin(passwords, eq(users.id, passwords.userId))
    .where(eq(users.email, email))
    .get();

  if (!user) return null;

  const isValidPassword = bcrypt.compareSync(
    password,
    (user.passwords.hash as string) || ""
  );

  if (!isValidPassword) return null;

  return user.users;
}

export async function createUserSession(userId: string, redirectUrl: string) {
  const session = await getSession();
  session.set("userId", userId);
  // console.log("SessionData:  [createUserSession fn]", JSON.stringify(session));
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function register({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
  avatar,
}: RegistrationData) {
  // validate
  if (!firstName || !lastName || !email || !password || !phone) {
    return {
      message: "missing credentials",
      user: null,
    };
  }

  // check if email exists
  const existingUser = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser && existingUser.email) {
    return {
      message: "An account with this email exists",
      user: null,
    }; // user with email exists
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
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (userRecord) {
    // create password record
    const userPassword = await bcrypt.hash(password, 10);
    const newPassword = await db
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

export async function requireUserId({
  request,
  redirectTo = new URL(request.url).pathname,
}: {
  request: Request;
  redirectTo?: string;
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    redirect(`/account/login?${searchParams}`);
  }
  return userId;
}

// this session gets deleted when a user authenticates
export async function createUnknownUserSession(
  userId: string = uuidv4(),
  redirectUrl: string
) {
  const session = await getTempSession();
  session.set("unknownUserId", userId);
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitTempSession(session),
    },
  });
}

export async function transferCartItemsToKnownUser({
  request,
  redirectUrl,
}: {
  request: Request;
  redirectUrl: string;
}) {
  const unknownUserSession = await getTempSession(
    request.headers.get("Cookie")
  );
  const unknownUserId = unknownUserSession.get("unknownUserId");
  if (unknownUserId) {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    // update cart items with unknown user id
    const reassignedCartItems = await db
      .update(cartItems)
      .set({ userId })
      .where(eq(cartItems.userId, unknownUserId))
      .returning()
      .all();

    // delete unknown user session
    return redirect(redirectUrl, {
      headers: {
        "Set-Cookie": await destroyTempSession(unknownUserSession),
      },
    });
  }
  return true;
}
