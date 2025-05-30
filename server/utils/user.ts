import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "~~/server/database";
import { type NewUser, userTable } from "~~/server/database/schema/auth";

export async function getAllUser() {
  return await db.query.userTable.findMany({
    orderBy: desc(userTable.createdAt),
    where: ne(userTable.email, "admin@gmail.com"),
  });
}
export async function getAllUserAdmin() {
  return await db.query.userTable.findMany({
    orderBy: desc(userTable.createdAt),
    where: ne(userTable.role, "user"),
  });
}

export async function getAllUserInactive() {
  return await db.query.userTable.findMany({
    orderBy: desc(userTable.createdAt),
    where: and(
      ne(userTable.email, "admin@gmail.com"),
      eq(userTable.status, false)
    ),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
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
