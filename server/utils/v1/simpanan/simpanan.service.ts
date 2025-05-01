import { and, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  penarikanTable,
  setoranTable,
} from "~~/server/database/schema/simpanan";
import type { TSaldoSimpanan } from "./dto/list-simpanan.dto";

export async function getSaldoSimpanan({ anggotaId }: TSaldoSimpanan) {
  try {
    const [setoran] = await db
      .select({
        sum: sql<number>`COALESCE(SUM(${setoranTable.nilai}), 0)`,
      })
      .from(setoranTable)
      .where(
        and(
          eq(setoranTable.anggotaId, anggotaId),
          eq(setoranTable.jenis, "Simpanan"),
          eq(setoranTable.status, 1)
        )
      );

    const [penarikan] = await db
      .select({
        sum: sql<number>`COALESCE(SUM(${penarikanTable.nilai}), 0)`,
      })
      .from(penarikanTable)
      .where(
        and(
          eq(penarikanTable.anggotaId, anggotaId),
          eq(penarikanTable.status, 1)
        )
      );

    return setoran!.sum - penarikan!.sum;
  } catch (error) {
    console.error("Failed to get Saldo Simpanan", error);
    throw InternalError;
  }
}

export async function getTotalSaham() {
  try {
    const [saham] = await db
      .select({
        sum: sql<number>`COALESCE(SUM(${setoranTable.nilai}), 0)`,
      })
      .from(setoranTable)
      .where(and(eq(setoranTable.jenis, "Saham"), eq(setoranTable.status, 1)));

    return saham!.sum;
  } catch (error) {
    console.error("Failed to get Total Saham", error);
    throw InternalError;
  }
}
