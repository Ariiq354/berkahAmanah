import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { relations } from "drizzle-orm";
import { userTable } from "./auth";

export const akunTable = sqliteTable("akun", {
  id: int().primaryKey({ autoIncrement: true }),
  namaAkun: text().notNull().unique(),
  kodeAkun: text().notNull(),
  status: int({ mode: "boolean" }).notNull().default(true),
  ...timestamp,
});

export const transaksiTable = sqliteTable("transaksi", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
  akunId: int()
    .notNull()
    .references(() => akunTable.id),
  nilai: int().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  keterangan: text().notNull(),
  ...timestamp,
});

export const transaksiRelations = relations(transaksiTable, ({ one }) => ({
  anggota: one(userTable, {
    fields: [transaksiTable.anggotaId],
    references: [userTable.id],
  }),
  akun: one(akunTable, {
    fields: [transaksiTable.akunId],
    references: [akunTable.id],
  }),
}));

export type NewAkun = typeof akunTable.$inferInsert;
export type NewTransaksi = typeof transaksiTable.$inferInsert;
