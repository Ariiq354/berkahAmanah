import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewSetoran,
  penarikanTable,
  setoranTable,
} from "~~/server/database/schema/simpanan";

export async function getAllSetoran() {
  return await db.query.setoranTable.findMany({
    orderBy: desc(setoranTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function getSaldoSimpanan(anggotaId: number) {
  const [setoran] = await db
    .select({
      sum: sql<number>`COALESCE(SUM(${setoranTable.nilai}), 0)`,
    })
    .from(setoranTable)
    .where(
      and(
        eq(setoranTable.anggotaId, anggotaId),
        eq(setoranTable.jenis, "Simpanan"),
        eq(setoranTable.status, true)
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
        eq(penarikanTable.status, true)
      )
    );

  return setoran!.sum - penarikan!.sum;
}

export async function createSetoran(data: NewSetoran) {
  return await db
    .insert(setoranTable)
    .values(data)
    .returning({ insertedId: setoranTable.id });
}
