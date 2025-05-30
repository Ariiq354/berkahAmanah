import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
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

export async function getAllTransaksiInput() {
  return await db.query.transaksiTable.findMany({
    orderBy: desc(transaksiTable.createdAt),
    where: like(transaksiTable.kodeTransaksi, "TRX%"),
    with: {
      akun: {
        columns: {
          kodeAkun: true,
          namaAkun: true,
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

export async function getLaba() {
  const res = await db
    .select({
      year: sql<string>`strftime('%Y', ${transaksiTable.createdAt})`.as("year"),
      sum: sql<string>`COALESCE(SUM(CASE WHEN ${transaksiTable.kodeAkun} LIKE '4%' THEN ${transaksiTable.nilai} ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ${transaksiTable.kodeAkun} LIKE '5%' THEN ${transaksiTable.nilai} ELSE 0 END), 0)`.as(
        "labaRugi"
      ),
    })
    .from(transaksiTable)
    .where(
      and(
        sql`strftime('%Y', ${transaksiTable.createdAt}) BETWEEN strftime('%Y', 'now', '-7 years') AND strftime('%Y', 'now')`
      )
    )
    .groupBy(sql`strftime('%Y', ${transaksiTable.createdAt})`)
    .orderBy(sql`year`);

  const currentYear = new Date().getFullYear();
  const yearlyArray = Array.from({ length: 8 }, (_, i) => {
    const year = currentYear - 7 + i;
    const yearData = res.find((item) => parseInt(item.year, 10) === year);
    return yearData ? parseFloat(yearData.sum) : 0; // Default to 0 if no data for the year
  });

  return yearlyArray;
}
