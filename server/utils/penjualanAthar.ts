import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  type NewPenjualanAthar,
  pembelianAtharTable,
  penjualanAtharTable,
} from "~~/server/database/schema/athar";

export async function getAllPenjualanAthar() {
  return await db.query.penjualanAtharTable.findMany({
    orderBy: desc(penjualanAtharTable.createdAt),
  });
}

export async function getAllPenjualanAtharInactive() {
  return await db.query.penjualanAtharTable.findMany({
    where: eq(penjualanAtharTable.status, false),
    orderBy: desc(penjualanAtharTable.createdAt),
  });
}

export async function createPenjualanAthar(data: NewPenjualanAthar) {
  return await db
    .insert(penjualanAtharTable)
    .values(data)
    .returning({ insertedId: penjualanAtharTable.id });
}

export async function updatePenjualanAthar(
  id: number,
  data: Partial<NewPenjualanAthar>
) {
  return await db
    .update(penjualanAtharTable)
    .set(data)
    .where(eq(penjualanAtharTable.id, id));
}

export async function getRemainingGalon() {
  const penjualan = db
    .select({
      jumlahGalon: penjualanAtharTable.jumlahGalon,
      price: penjualanAtharTable.nilai,
      originalPrice:
        sql<number>`(${penjualanAtharTable.nilai} - ${penjualanAtharTable.margin}) / ${penjualanAtharTable.jumlahGalon}`.as(
          "originalPrice"
        ),
    })
    .from(penjualanAtharTable)
    .as("penjualan");

  // Step 2: Calculate price per pillow in Buy Table
  const pembelian = db
    .select({
      jumlahGalon: pembelianAtharTable.jumlahGalon,
      price:
        sql<number>`${pembelianAtharTable.nilai} / ${pembelianAtharTable.jumlahGalon}`.as(
          "price"
        ),
    })
    .from(pembelianAtharTable)
    .where(eq(pembelianAtharTable.status, true))
    .as("pembelian");

  // Step 3: Match Buy and Sell Data
  const matched = db
    .select({
      price: pembelian.price, // Price per pillow in Buy Table
      jumlahGalon: pembelian.jumlahGalon, // Buy Amount
      nilaiPembelian: sql`COALESCE(SUM(${pembelian.price}), 0)`.as(
        "nilaiPembelian"
      ),
      nilaiPenjualan: sql`COALESCE(SUM(${penjualan.price}), 0)`.as(
        "nilaiPenjelian"
      ),
      totalJual: sql`
        COALESCE(SUM(${penjualan.jumlahGalon}), 0)
      `.as("totalJual"),
    })
    .from(pembelian)
    .leftJoin(penjualan, sql`${pembelian.price} = ${penjualan.originalPrice}`)
    .groupBy(sql`${pembelian.price}`, pembelian.jumlahGalon)
    .as("matched");

  // Step 4: Calculate Remaining Amount
  const result = await db
    .select({
      price: matched.price,
      nilaiPembelian: matched.nilaiPembelian,
      nilaiPenjualan: matched.nilaiPenjualan,
      jumlahGalon: sql<number>`${matched.jumlahGalon} - ${matched.totalJual}`,
    })
    .from(matched)
    .orderBy(sql`${matched.price}`);

  return result;
}

export async function getDataPenjualan() {
  const res = await db
    .select({
      month: sql<string>`strftime('%m', ${penjualanAtharTable.tanggal})`.as(
        "month"
      ),
      sum: sql<string>`COALESCE(SUM(${penjualanAtharTable.jumlahGalon}), 0)`,
    })
    .from(penjualanAtharTable)
    .where(
      and(
        eq(penjualanAtharTable.status, true),
        sql`strftime('%Y', ${penjualanAtharTable.tanggal}) = strftime('%Y', 'now')`
      )
    )
    .groupBy(sql`strftime('%m', ${penjualanAtharTable.tanggal})`)
    .orderBy(sql`month`);

  const monthlyArray = Array.from({ length: 12 }, (_, i) => {
    const monthData = res.find((item) => parseInt(item.month, 10) === i + 1);
    return monthData ? parseFloat(monthData.sum) : 0; // Default to 0 if no data for the month
  });

  return monthlyArray;
}
