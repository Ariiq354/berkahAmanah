import type { H3Event } from "h3";
import { db } from "../database";
import { eq } from "drizzle-orm";
import { userTable } from "../database/schema/auth";

export function protectFunction(event: H3Event) {
  if (!event.context.session) {
    throw createError({
      statusCode: 401,
      message: "Unauthenticated",
    });
  }

  return event.context.user!;
}

export async function generateRandomNumber() {
  const MAX_ATTEMPTS = 1000;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const randomSixDigitNumber = String(
      Math.floor(100000 + Math.random() * 900000)
    );
    const exist = await db.query.userTable.findFirst({
      where: eq(userTable.noUser, randomSixDigitNumber),
    });
    if (!exist) {
      return randomSixDigitNumber;
    }
    attempts++;
  }

  throw new Error("Failed to generate a unique number after 1000 attempts.");
}
