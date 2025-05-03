import { like, sql } from "drizzle-orm";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { db } from "~~/server/database";

export async function getTransactionCode(
  code: string,
  table: SQLiteTableWithColumns<any>
) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const date = `${year}${month}${day}`;

  try {
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
  } catch (error) {
    console.error("Failed to get Transaction Code", error);
    throw InternalError;
  }
}

// Overload definitions
export function HttpResponse(): { statusCode: number; message: string };
export function HttpResponse<T>(data: T): {
  statusCode: number;
  message: string;
  data: T;
};
export function HttpResponse<T, K>(
  data: T,
  metadata: K
): { statusCode: number; message: string; data: T; metadata: K };

// Implementation
export function HttpResponse<T, K>(data?: T, metadata?: K) {
  return {
    statusCode: 200,
    message: "Success",
    ...(data !== undefined && { data }),
    ...(metadata !== undefined && { metadata }),
  };
}
