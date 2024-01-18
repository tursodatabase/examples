import { createCookieSessionStorage } from "@vercel/remix";

type SessionData = {
  agentId: string;
};

type SessionFlashData = {
  error: string;
};

type Env = {
  SESSION_SECRET: String;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__agent_session",
      httpOnly: true,
      maxAge: 7 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secrets: [(process.env as unknown as Env).SESSION_SECRET?.trim()],
      secure: true,
    },
  });
