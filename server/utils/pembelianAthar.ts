import { desc, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPembelianAthar,
  pembelianAtharTable,
  penjualanAtharTable,
} from "~~/server/database/schema/athar";

export async function getAllPembelianAthar() {
  return await db.query.pembelianAtharTable.findMany({
    orderBy: desc(pembelianAtharTable.createdAt),
  });
}

export async function getAllPembelianAtharInactive() {
  return await db.query.pembelianAtharTable.findMany({
    where: eq(pembelianAtharTable.status, false),
    orderBy: desc(pembelianAtharTable.createdAt),
  });
}

export async function getTotalGalon() {
  const [pembelian] = await db
    .select({
      sum: sql<number>`COALESCE(SUM(${pembelianAtharTable.jumlahGalon}), 0)`,
    })
    .from(pembelianAtharTable);

  const [penjualan] = await db
    .select({
      sum: sql<number>`COALESCE(SUM(${penjualanAtharTable.jumlahGalon}), 0)`,
    })
    .from(penjualanAtharTable);

  return pembelian!.sum - penjualan!.sum;
}

export async function createPembelianAthar(data: NewPembelianAthar) {
  return await db
    .insert(pembelianAtharTable)
    .values(data)
    .returning({ insertedId: pembelianAtharTable.id });
}

export async function updatePembelianAthar(
  id: number,
  data: Partial<NewPembelianAthar>
) {
  return await db
    .update(pembelianAtharTable)
    .set(data)
    .where(eq(pembelianAtharTable.id, id));
}
