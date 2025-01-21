import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPembayaranHutangAthar,
  pembayaranHutangAtharTable,
} from "~~/server/database/schema/athar";

export async function createPembayaranHutangAthar(
  data: NewPembayaranHutangAthar
) {
  return await db
    .insert(pembayaranHutangAtharTable)
    .values(data)
    .returning({ insertedId: pembayaranHutangAtharTable.id });
}

export async function updatePembayaranHutangAthar(
  id: number,
  data: Partial<NewPembayaranHutangAthar>
) {
  return await db
    .update(pembayaranHutangAtharTable)
    .set(data)
    .where(eq(pembayaranHutangAtharTable.id, id));
}
