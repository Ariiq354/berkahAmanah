import { desc } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPenarikan,
  penarikanTable,
} from "~~/server/database/schema/simpanan";

export async function getAllPenarikan() {
  return await db.query.penarikanTable.findMany({
    orderBy: desc(penarikanTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function createPenarikan(data: NewPenarikan) {
  return await db
    .insert(penarikanTable)
    .values(data)
    .returning({ insertedId: penarikanTable.id });
}
