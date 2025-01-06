import { desc } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPemindahbukuan,
  pemindahbukuanTable,
} from "~~/server/database/schema/simpanan";

export async function getAllPemindahbukuan() {
  return await db.query.pemindahbukuanTable.findMany({
    orderBy: desc(pemindahbukuanTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
      setoran: {
        columns: {
          jumlahSaham: true,
          anggotaId: true,
        },
      },
    },
  });
}

export async function createPemindahbukuan(data: NewPemindahbukuan) {
  return await db.insert(pemindahbukuanTable).values(data);
}
