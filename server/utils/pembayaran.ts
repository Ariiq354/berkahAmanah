import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPembayaranAthar,
  pembayaranAtharTable,
} from "~~/server/database/schema/athar";

export async function getAllPembayaranAthar() {
  return await db.query.pembayaranAtharTable.findMany({
    orderBy: desc(pembayaranAtharTable.createdAt),
    with: {
      penjualan: {
        columns: {
          kodeTransaksi: true,
        },
      },
    },
  });
}

export async function createPembayaranAthar(data: NewPembayaranAthar) {
  return await db
    .insert(pembayaranAtharTable)
    .values(data)
    .returning({ insertedId: pembayaranAtharTable.id });
}

export async function updatePembayaranAthar(
  id: number,
  data: Partial<NewPembayaranAthar>
) {
  return await db
    .update(pembayaranAtharTable)
    .set(data)
    .where(eq(pembayaranAtharTable.id, id));
}
