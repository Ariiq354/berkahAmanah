import type { Session, UserLucia } from "../database/schema/auth";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      throw createError({
        statusCode: 403,
      });
    }
  }

  const sessionToken = getCookie(event, "auth_session") ?? null;
  if (!sessionToken) {
    event.context.session = null;
    event.context.user = null;
    return;
  }
  const { session, user } = await validateSession(sessionToken);
  if (session !== null) {
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: UserLucia | null;
    session: Session | null;
  }
}
