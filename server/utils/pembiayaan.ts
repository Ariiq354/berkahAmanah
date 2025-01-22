import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  angsuranTable,
  type NewPembiayaan,
  pembiayaanTable,
} from "~~/server/database/schema/pembiayaan";
import { persetujuanPembiayaanTable } from "../database/schema/persetujuan";

export async function getAllPembiayaan(anggotaId?: number) {
  return await db.query.pembiayaanTable.findMany({
    orderBy: desc(pembiayaanTable.createdAt),
    where: anggotaId ? eq(pembiayaanTable.anggotaId, anggotaId) : undefined,
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

export async function getAllPembiayaanByAnggotaId(anggotaId?: number) {
  const conditions = [eq(pembiayaanTable.status, 1)];

  if (anggotaId) {
    conditions.push(eq(pembiayaanTable.anggotaId, anggotaId));
  }

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
    .where(and(...conditions));

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

export async function getNasabahPembiayaan() {
  const [res] = await db
    .select({
      count: count(pembiayaanTable.id),
    })
    .from(pembiayaanTable)
    .where(eq(pembiayaanTable.status, 1));

  return res!.count;
}

export async function getAntrianPembiayaan() {
  const [res] = await db
    .select({
      count: count(pembiayaanTable.id),
    })
    .from(pembiayaanTable)
    .where(eq(pembiayaanTable.status, 0));

  return res!.count;
}

export async function getDataPembiayaan() {
  const res = await db
    .select({
      year: sql<string>`strftime('%Y', ${pembiayaanTable.createdAt})`.as(
        "year"
      ),
      sum: sql<string>`COALESCE(SUM(${pembiayaanTable.jumlah}), 0)`,
    })
    .from(pembiayaanTable)
    .where(
      and(
        eq(pembiayaanTable.status, 1),
        sql`strftime('%Y', ${pembiayaanTable.createdAt}) BETWEEN strftime('%Y', 'now', '-7 years') AND strftime('%Y', 'now')`
      )
    )
    .groupBy(sql`strftime('%Y', ${pembiayaanTable.createdAt})`)
    .orderBy(sql`year`);

  const currentYear = new Date().getFullYear();
  const yearlyArray = Array.from({ length: 8 }, (_, i) => {
    const year = currentYear - 7 + i;
    const yearData = res.find((item) => parseInt(item.year, 10) === year);
    return yearData ? parseFloat(yearData.sum) : 0; // Default to 0 if no data for the year
  });

  return yearlyArray;
}
