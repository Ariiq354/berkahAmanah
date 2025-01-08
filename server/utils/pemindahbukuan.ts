import { desc, eq } from "drizzle-orm";
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
        },
      },
    },
  });
}

export async function getAllPemindahbukuanInactive() {
  return await db.query.pemindahbukuanTable.findMany({
    orderBy: desc(pemindahbukuanTable.createdAt),
    where: eq(pemindahbukuanTable.status, 0),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
          noUser: true,
        },
      },
      setoran: {
        columns: {
          jumlahSaham: true,
        },
      },
    },
  });
}

export async function getPemindahbukuanById(id: number) {
  return await db.query.pemindahbukuanTable.findFirst({
    where: eq(pemindahbukuanTable.id, id),
    with: {
      setoran: {
        columns: {
          anggotaId: true,
          jumlahSaham: true,
        },
      },
    },
  });
}

export async function createPemindahbukuan(data: NewPemindahbukuan) {
  return await db.insert(pemindahbukuanTable).values(data);
}

export async function updatePemindahbukuanStatus(status: number, id: number) {
  return await db
    .update(pemindahbukuanTable)
    .set({
      status,
    })
    .where(eq(pemindahbukuanTable.id, id));
}
