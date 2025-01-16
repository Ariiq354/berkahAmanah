import { and, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewSetoran,
  penarikanTable,
  setoranTable,
} from "~~/server/database/schema/simpanan";

export async function getAllSetoran() {
  return await db.query.setoranTable.findMany({
    where: lt(setoranTable.status, 4),
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

export async function getAllSetoranInactive() {
  return await db.query.setoranTable.findMany({
    orderBy: desc(setoranTable.createdAt),
    where: eq(setoranTable.status, 0),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
          noUser: true,
        },
      },
    },
  });
}

export async function getSetoranById(id: number) {
  return await db.query.setoranTable.findFirst({
    where: eq(setoranTable.id, id),
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
        eq(setoranTable.status, 1)
      )
    );

  const [penarikan] = await db
    .select({
      sum: sql<number>`COALESCE(SUM(${penarikanTable.nilai}), 0)`,
    })
    .from(penarikanTable)
    .where(
      and(eq(penarikanTable.anggotaId, anggotaId), eq(penarikanTable.status, 1))
    );

  return setoran!.sum - penarikan!.sum;
}

export async function getAllSetoranByAnggotaId(anggotaId: number) {
  return await db.query.setoranTable.findMany({
    where: eq(setoranTable.anggotaId, anggotaId),
  });
}

export async function getTotalSaham() {
  const [saham] = await db
    .select({
      sum: sql<number>`COALESCE(SUM(${setoranTable.nilai}), 0)`,
    })
    .from(setoranTable)
    .where(and(eq(setoranTable.jenis, "Saham"), eq(setoranTable.status, 1)));

  return saham.sum;
}

export async function createSetoran(data: NewSetoran) {
  return await db
    .insert(setoranTable)
    .values(data)
    .returning({ insertedId: setoranTable.id });
}

export async function updateSetoranStatus(status: number, id: number) {
  return await db
    .update(setoranTable)
    .set({
      status,
    })
    .where(eq(setoranTable.id, id));
}
