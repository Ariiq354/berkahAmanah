import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { type NewSaham, sahamTable } from "~~/server/database/schema/saham";

export async function getAllSaham() {
  return await db.query.sahamTable.findMany({
    orderBy: desc(sahamTable.createdAt),
  });
}

export async function getSahamNow() {
  return await db.query.sahamTable.findFirst({
    orderBy: desc(sahamTable.createdAt),
  });
}

export async function createSaham(data: NewSaham) {
  return await db.insert(sahamTable).values(data);
}

export async function updateSaham(id: number, data: Partial<NewSaham>) {
  return await db.update(sahamTable).set(data).where(eq(sahamTable.id, id));
}

export async function deleteSaham(id: number[]) {
  return await db.delete(sahamTable).where(inArray(sahamTable.id, id));
}

export async function getDataSaham() {
  const currentYear = new Date().getFullYear();

  // First, get the max dates for each year
  const maxDatesSubquery = db
    .select({
      maxDate: sql`MAX(${sahamTable.createdAt})`.as("max_date"),
    })
    .from(sahamTable)
    .where(
      sql`strftime('%Y', ${sahamTable.createdAt}) BETWEEN strftime('%Y', 'now', '-7 years') AND strftime('%Y', 'now')`
    )
    .groupBy(sql`strftime('%Y', ${sahamTable.createdAt})`);

  // Main query
  const res = await db
    .select({
      year: sql<string>`strftime('%Y', ${sahamTable.createdAt})`.as("year"),
      value: sahamTable.nilai,
    })
    .from(sahamTable)
    .where(
      and(
        sql`strftime('%Y', ${sahamTable.createdAt}) BETWEEN strftime('%Y', 'now', '-7 years') AND strftime('%Y', 'now')`,
        inArray(sahamTable.createdAt, maxDatesSubquery)
      )
    )
    .orderBy(sql`strftime('%Y', ${sahamTable.createdAt})`);

  const yearlyArray = Array.from({ length: 8 }, (_, i) => {
    const year = currentYear - 7 + i;
    const yearData = res.find((item) => parseInt(item.year, 10) === year);
    return yearData ? yearData.value : 0; // Default to 0 if no data for the year
  });

  return yearlyArray;
}
