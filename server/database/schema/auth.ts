import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";

export const userTable = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  noUser: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  namaLengkap: text().notNull(),
  noTelepon: text().notNull(),
  role: text({
    enum: ["admin", "user"],
  })
    .notNull()
    .default("user"),
  ...timestamp,
});

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => userTable.id),
  expiresAt: int({ mode: "timestamp" }).notNull(),
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

export type ROLES = User["role"];

export type UserLucia = Omit<User, "createdAt" | "updatedAt" | "password">;

export type Session = typeof sessionTable.$inferSelect;
export type NewSession = typeof sessionTable.$inferInsert;
