import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPembiayaan,
  pembiayaanTable,
} from "~~/server/database/schema/pembiayaan";

export async function getAllPembiayaan() {
  return await db.query.pembiayaanTable.findMany({
    orderBy: desc(pembiayaanTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
      persetujuan: {
        columns: {
          margin: true,
          nilai: true,
        },
      },
    },
  });
}

export async function getAllPembiayaanInactive() {
  return await db.query.pembiayaanTable.findMany({
    orderBy: desc(pembiayaanTable.createdAt),
    where: eq(pembiayaanTable.status, 0),
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

export async function getPembiayaanById(id: number) {
  return await db.query.pembiayaanTable.findFirst({
    where: eq(pembiayaanTable.id, id),
  });
}

export async function createPembiayaan(data: NewPembiayaan) {
  return await db
    .insert(pembiayaanTable)
    .values(data)
    .returning({ insertedId: pembiayaanTable.id });
}

export async function updatePembiayaanStatus(status: number, id: number) {
  return await db
    .update(pembiayaanTable)
    .set({
      status,
    })
    .where(eq(pembiayaanTable.id, id));
}
