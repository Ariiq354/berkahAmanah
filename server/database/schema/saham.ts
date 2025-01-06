import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";

export const sahamTable = sqliteTable("saham", {
  id: int().primaryKey({ autoIncrement: true }),
  nilai: int().notNull(),
  ...timestamp,
});

export type NewSaham = typeof sahamTable.$inferInsert;
