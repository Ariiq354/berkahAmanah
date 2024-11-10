import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { type NewUser, userTable } from "~~/server/database/schema/auth";

export async function getAllUser() {
  return await db.query.userTable.findMany({
    orderBy: desc(userTable.createdAt),
  });
}

export async function getUserByUsername(username: string) {
  return await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });
}

export async function createUser(data: NewUser) {
  return await db.insert(userTable).values(data);
}

export async function updateUser(id: number, data: Partial<NewUser>) {
  return await db.update(userTable).set(data).where(eq(userTable.id, id));
}

export async function deleteUser(id: number[]) {
  return await db.delete(userTable).where(inArray(userTable.id, id));
}
