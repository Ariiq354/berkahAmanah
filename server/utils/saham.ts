import { desc, eq, inArray } from "drizzle-orm";
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
