import { createCookieSessionStorage } from "@vercel/remix";

type OrgSessionData = {
  orgId: string;
};

type AgentSessionData = {
  agentId: string;
};

type SessionFlashData = {
  error: string;
};

type Env = {
  SESSION_SECRET: String;
};

export const {
  getSession: getOrgSession,
  commitSession: commitOrgSession,
  destroySession: destroyOrgSession,
} = createCookieSessionStorage<OrgSessionData, SessionFlashData>({
  cookie: {
    name: "__org_session",
    httpOnly: true,
    maxAge: 7 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [(process.env as unknown as Env).SESSION_SECRET?.trim()],
    secure: true,
  },
});

export const {
  getSession: getAgentSession,
  commitSession: commitAgentSession,
  destroySession: destroyAgentSession,
} = createCookieSessionStorage<AgentSessionData, SessionFlashData>({
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
