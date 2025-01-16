import { desc, eq, lt } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPenarikan,
  penarikanTable,
} from "~~/server/database/schema/simpanan";

export async function getAllPenarikan() {
  return await db.query.penarikanTable.findMany({
    orderBy: desc(penarikanTable.createdAt),
    where: lt(penarikanTable.status, 4),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function getAllPenarikanInactive() {
  return await db.query.penarikanTable.findMany({
    orderBy: desc(penarikanTable.createdAt),
    where: eq(penarikanTable.status, 0),
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

export async function getPenarikanById(id: number) {
  return await db.query.penarikanTable.findFirst({
    where: eq(penarikanTable.id, id),
  });
}

export async function getAllPenarikanByAnggotaId(anggotaId: number) {
  return await db.query.penarikanTable.findMany({
    where: eq(penarikanTable.anggotaId, anggotaId),
  });
}

export async function createPenarikan(data: NewPenarikan) {
  return await db
    .insert(penarikanTable)
    .values(data)
    .returning({ insertedId: penarikanTable.id });
}

export async function updatePenarikanStatus(status: number, id: number) {
  return await db
    .update(penarikanTable)
    .set({
      status,
    })
    .where(eq(penarikanTable.id, id));
}
