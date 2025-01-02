import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewTransaksi,
  transaksiTable,
} from "~~/server/database/schema/transaksi";

export async function getAllTransaksi() {
  return await db.query.transaksiTable.findMany({
    orderBy: desc(transaksiTable.createdAt),
    with: {
      akun: {
        columns: {
          kodeAkun: true,
          namaAkun: true,
        },
      },
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function createTransaksi(data: NewTransaksi) {
  return await db.insert(transaksiTable).values(data);
}

export async function updateTransaksi(id: number, data: Partial<NewTransaksi>) {
  return await db
    .update(transaksiTable)
    .set(data)
    .where(eq(transaksiTable.id, id));
}

export async function deleteTransaksi(id: number[]) {
  return await db.delete(transaksiTable).where(inArray(transaksiTable.id, id));
}
