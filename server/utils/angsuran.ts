import { and, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  angsuranTable,
  pembiayaanTable,
  type NewAngsuran,
} from "~~/server/database/schema/pembiayaan";
import { persetujuanPembiayaanTable } from "../database/schema/persetujuan";
import { userTable } from "../database/schema/auth";

export async function getAllPembiayaanActive(anggotaId?: number) {
  const condition = [eq(pembiayaanTable.status, 1)];
  if (anggotaId) {
    condition.push(eq(pembiayaanTable.anggotaId, anggotaId));
  }

  const result = await db
    .select({
      id: pembiayaanTable.id,
      kodeTransaksi: pembiayaanTable.kodeTransaksi,
      namaLengkap: userTable.namaLengkap,
      noUser: userTable.noUser,
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
    .innerJoin(userTable, eq(pembiayaanTable.anggotaId, userTable.id))
    .groupBy(pembiayaanTable.id)
    .having(
      lt(
        sql`COALESCE(SUM(${angsuranTable.jumlah}), 0)`,
        persetujuanPembiayaanTable.nilai
      )
    )
    .where(and(...condition));

  return result;
}

export async function getAllAngsuran(anggotaId?: number) {
  return await db
    .select({
      id: angsuranTable.id,
      status: angsuranTable.status,
      kodeTransaksi: angsuranTable.kodeTransaksi,
      tanggal: angsuranTable.tanggal,
      keterangan: angsuranTable.keterangan,
      jumlah: angsuranTable.jumlah,
      pembiayaanId: angsuranTable.pembiayaanId,
      namaLengkap: userTable.namaLengkap,
      kodePembiayaan: pembiayaanTable.kodeTransaksi,
      nilaiPersetujuan: persetujuanPembiayaanTable.nilai,
      marginPersetujuan: persetujuanPembiayaanTable.margin,
    })
    .from(angsuranTable)
    .innerJoin(
      pembiayaanTable,
      eq(angsuranTable.pembiayaanId, pembiayaanTable.id)
    )
    .innerJoin(userTable, eq(pembiayaanTable.anggotaId, userTable.id))
    .innerJoin(
      persetujuanPembiayaanTable,
      eq(persetujuanPembiayaanTable.pembiayaanId, pembiayaanTable.id)
    )
    .orderBy(desc(angsuranTable.createdAt))
    .where(anggotaId ? eq(pembiayaanTable.anggotaId, anggotaId) : undefined);
}

export async function getAllAngsuranByPembiayaanId(
  pembiayaanId: number,
  anggotaId?: number
) {
  return await db
    .select({
      id: angsuranTable.id,
      kodeTransaksi: angsuranTable.kodeTransaksi,
      tanggal: angsuranTable.tanggal,
      noPembiayaan: pembiayaanTable.kodeTransaksi,
      jumlah: angsuranTable.jumlah,
      pembiayaanId: angsuranTable.pembiayaanId,
      nilaiSetuju: persetujuanPembiayaanTable.nilai,
      marginSetuju: persetujuanPembiayaanTable.margin,
    })
    .from(angsuranTable)
    .leftJoin(
      pembiayaanTable,
      eq(angsuranTable.pembiayaanId, pembiayaanTable.id)
    )
    .innerJoin(
      persetujuanPembiayaanTable,
      eq(pembiayaanTable.id, persetujuanPembiayaanTable.pembiayaanId)
    )
    .where(
      and(
        eq(angsuranTable.status, 1),
        eq(angsuranTable.pembiayaanId, pembiayaanId),
        anggotaId ? eq(pembiayaanTable.anggotaId, anggotaId) : undefined
      )
    );
}

export async function getAllAngsuranInactive() {
  return await db.query.angsuranTable.findMany({
    orderBy: desc(angsuranTable.createdAt),
    where: eq(angsuranTable.status, 0),
    with: {
      pembiayaan: {
        with: {
          anggota: {
            columns: {
              namaLengkap: true,
              noUser: true,
            },
          },
          persetujuan: {
            columns: {
              nilai: true,
              margin: true,
            },
          },
        },
      },
    },
  });
}

export async function getAngsuranById(id: number) {
  return await db.query.angsuranTable.findFirst({
    where: eq(angsuranTable.id, id),
    with: {
      pembiayaan: {
        columns: {
          anggotaId: true,
        },
        with: {
          persetujuan: {
            columns: {
              nilai: true,
              margin: true,
            },
          },
        },
      },
    },
  });
}

export async function createAngsuran(data: NewAngsuran) {
  return await db
    .insert(angsuranTable)
    .values(data)
    .returning({ insertedId: angsuranTable.id });
}

export async function updateAngsuranStatus(status: number, id: number) {
  return await db
    .update(angsuranTable)
    .set({
      status,
    })
    .where(eq(angsuranTable.id, id));
}
