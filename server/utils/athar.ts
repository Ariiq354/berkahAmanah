import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { type NewAthar, atharTable } from "~~/server/database/schema/athar";

export async function getAllAthar() {
  return await db.query.atharTable.findMany({
    orderBy: desc(atharTable.createdAt),
  });
}

export async function getAtharNow() {
  return await db.query.atharTable.findFirst({
    orderBy: desc(atharTable.createdAt),
  });
}

export async function createAthar(data: NewAthar) {
  return await db.insert(atharTable).values(data);
}

export async function updateAthar(id: number, data: Partial<NewAthar>) {
  return await db.update(atharTable).set(data).where(eq(atharTable.id, id));
}

export async function deleteAthar(id: number[]) {
  return await db.delete(atharTable).where(inArray(atharTable.id, id));
}
