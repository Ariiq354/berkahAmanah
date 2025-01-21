import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  akunTable,
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

export async function getAccountsData(tahun: string, accountPrefix: string) {
  return await db
    .select({
      namaAkun: akunTable.namaAkun,
      jan: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '01' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      feb: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '02' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      mar: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '03' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      apr: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '04' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      may: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '05' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      jun: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '06' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      jul: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '07' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      aug: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '08' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      sep: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '09' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      oct: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '10' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      nov: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '11' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
      dec: sql<number>`COALESCE(SUM(CASE WHEN strftime('%m', ${transaksiTable.tanggal}) = '12' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`,
    })
    .from(akunTable)
    .leftJoin(transaksiTable, eq(akunTable.kodeAkun, transaksiTable.kodeAkun))
    .groupBy(akunTable.kodeAkun)
    .where(
      sql`${akunTable.kodeAkun} LIKE ${accountPrefix} AND (strftime('%Y', ${transaksiTable.tanggal}) = ${tahun} OR ${transaksiTable.tanggal} IS NULL)`
    );
}
