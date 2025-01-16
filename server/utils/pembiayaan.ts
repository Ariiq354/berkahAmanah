import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  angsuranTable,
  type NewPembiayaan,
  pembiayaanTable,
} from "~~/server/database/schema/pembiayaan";
import { persetujuanPembiayaanTable } from "../database/schema/persetujuan";

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

export async function getAllPembiayaanByAnggotaId(anggotaId: number) {
  const result = await db
    .select({
      id: pembiayaanTable.id,
      kodeTransaksi: pembiayaanTable.kodeTransaksi,
      tujuan: pembiayaanTable.tujuan,
      pokok: persetujuanPembiayaanTable.nilai,
      margin: persetujuanPembiayaanTable.margin,
      tempo: persetujuanPembiayaanTable.tempo,
      totalAngsuran: sql<number>`COALESCE(SUM(${angsuranTable.jumlah}), 0)`,
    })
    .from(pembiayaanTable)
    .leftJoin(angsuranTable, eq(pembiayaanTable.id, angsuranTable.pembiayaanId))
    .innerJoin(
      persetujuanPembiayaanTable,
      eq(persetujuanPembiayaanTable.pembiayaanId, pembiayaanTable.id)
    )
    .groupBy(pembiayaanTable.id)
    .where(
      and(
        eq(pembiayaanTable.status, 1),
        eq(pembiayaanTable.anggotaId, anggotaId)
      )
    );

  return result;
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
