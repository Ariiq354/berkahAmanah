import { eq, like, sql } from "drizzle-orm";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import type { H3Event } from "h3";
import { db } from "../database";
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

export async function getTransactionCode(
  code: string,
  table: SQLiteTableWithColumns<any>
) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const date = `${year}${month}${day}`;

  const num = await db
    .select({
      num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(kode_transaksi, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(kode_transaksi, -3) AS INTEGER)) + 1), -3)
        END`,
    })
    .from(table)
    .where(
      like(
        sql`kode_transaksi`,
        sql`${code + "-"} || strftime('%Y%m%d', 'now') || '-%'`
      )
    );

  return code + "-" + date + "-" + num[0]!.num;
}

export function getCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
