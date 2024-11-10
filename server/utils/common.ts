import type { H3Event } from "h3";

export function protectFunction(event: H3Event) {
  if (!event.context.session) {
    throw createError({
      statusCode: 401,
    });
  }
}
