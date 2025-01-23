import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { relations } from "drizzle-orm";
import { userTable } from "./auth";

export const akunTable = sqliteTable("akun", {
  id: int().primaryKey({ autoIncrement: true }),
  namaAkun: text().notNull().unique(),
  kodeAkun: text().notNull().unique(),
  status: int({ mode: "boolean" }).notNull().default(true),
  ...timestamp,
});

export const transaksiTable = sqliteTable("transaksi", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
  kodeAkun: text()
    .notNull()
    .references(() => akunTable.kodeAkun),
  nilai: int().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  keterangan: text().notNull(),
  ...timestamp,
});

export const feeManagementTable = sqliteTable("fee_management", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
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
    fields: [transaksiTable.kodeAkun],
    references: [akunTable.kodeAkun],
  }),
}));

export const feeManagementRelations = relations(
  feeManagementTable,
  ({ one }) => ({
    anggota: one(userTable, {
      fields: [feeManagementTable.anggotaId],
      references: [userTable.id],
    }),
  })
);

export type NewAkun = typeof akunTable.$inferInsert;
export type NewTransaksi = typeof transaksiTable.$inferInsert;
export type NewFeeManagement = typeof feeManagementTable.$inferInsert;
