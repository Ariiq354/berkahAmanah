import type { H3Event } from "h3";
import type { Session, UserLucia } from "../database/schema/auth";
import {
  deleteSessionData,
  getUserSessionById,
  insertSessionData,
  updateSessionData,
} from "./session";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = "auth_session";

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256Hex(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(userId: number): Promise<Session> {
  const token = generateSessionToken();
  const sessionId = await sha256Hex(new TextEncoder().encode(token));
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS),
  };
  await insertSessionData(session);
  return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSessionData(sessionId);
}

export async function validateSession(sessionId: string) {
  const [result] = await getUserSessionById(sessionId);
  if (!result) {
    return { session: null, user: null };
  }
  const { user, session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSessionData(session.id);
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS / 2) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS);
    await updateSessionData(session.id, session);
  }
  return { session, user };
}

export function setSessionTokenCookie(
  event: H3Event,
  token: string,
  expiresAt: Date
) {
  setCookie(event, sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export function deleteSessionTokenCookie(event: H3Event) {
  deleteCookie(event, sessionCookieName);
}

export function verifyRequestOrigin(
  origin: string,
  allowedDomains: string[]
): boolean {
  if (!origin || allowedDomains.length === 0) {
    return false;
  }
  const originHost = safeURL(origin)?.host ?? null;
  if (!originHost) {
    return false;
  }
  for (const domain of allowedDomains) {
    let host: string | null;
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      host = safeURL(domain)?.host ?? null;
    } else {
      host = safeURL("https://" + domain)?.host ?? null;
    }
    if (originHost === host) {
      return true;
    }
  }
  return false;
}

function safeURL(url: URL | string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export type SessionValidationResult =
  | { session: Session; user: UserLucia }
  | { session: null; user: null };
