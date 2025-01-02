import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { type NewAkun, akunTable } from "~~/server/database/schema/transaksi";

export async function getAllAkun() {
  return await db.query.akunTable.findMany({
    orderBy: desc(akunTable.createdAt),
  });
}

export async function createAkun(data: NewAkun) {
  return await db.insert(akunTable).values(data);
}

export async function updateAkun(id: number, data: Partial<NewAkun>) {
  return await db.update(akunTable).set(data).where(eq(akunTable.id, id));
}

export async function deleteAkun(id: number[]) {
  return await db.delete(akunTable).where(inArray(akunTable.id, id));
}
