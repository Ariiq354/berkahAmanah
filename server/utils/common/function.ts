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

export class HttpResponse<T> {
  private statusCode: number;
  private message: string;
  private data: T | null;
  private metadata: object;

  constructor() {
    this.statusCode = 200;
    this.message = "Success";
    this.data = null;
    this.metadata = {};
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setStatusCode(code: number) {
    this.statusCode = code;
    return this;
  }

  setData(data: T | T[] | any) {
    this.data = data;
    return this;
  }

  setMeta(metadata: any) {
    this.metadata = metadata;
    return this;
  }

  getResponse() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      metadata: this.metadata,
    };
  }
}
