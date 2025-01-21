import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";

export const pembelianAtharTable = sqliteTable("pembelian_athar", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  jumlahGalon: int().notNull(),
  nilai: int().notNull(),
  tanggal: text().notNull(),
  status: int({ mode: "boolean" }).notNull().default(false),
  ...timestamp,
});

export const penjualanAtharTable = sqliteTable("penjualan_athar", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  jumlahGalon: int().notNull(),
  nilai: int().notNull(),
  tanggal: text().notNull(),
  margin: int().notNull(),
  status: int({ mode: "boolean" }).notNull().default(false),
  ...timestamp,
});

export const pembayaranAtharTable = sqliteTable("pembayaran_athar", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  idPenjualan: int()
    .notNull()
    .references(() => penjualanAtharTable.id),
  tanggal: text().notNull(),
  ...timestamp,
});

export const pembayaranHutangAtharTable = sqliteTable(
  "pembayaran_hutang_athar",
  {
    id: int().primaryKey({ autoIncrement: true }),
    kodeTransaksi: text().notNull(),
    idPembelian: int()
      .notNull()
      .references(() => pembelianAtharTable.id),
    tanggal: text().notNull(),
    ...timestamp,
  }
);

export const pembayaranAtharRelations = relations(
  pembayaranAtharTable,
  ({ one }) => ({
    penjualan: one(penjualanAtharTable, {
      fields: [pembayaranAtharTable.idPenjualan],
      references: [penjualanAtharTable.id],
    }),
  })
);

export const pembayaranHutangAtharRelations = relations(
  pembayaranHutangAtharTable,
  ({ one }) => ({
    pembelian: one(pembelianAtharTable, {
      fields: [pembayaranHutangAtharTable.idPembelian],
      references: [pembelianAtharTable.id],
    }),
  })
);

export type NewPembelianAthar = typeof pembelianAtharTable.$inferInsert;
export type NewPenjualanAthar = typeof penjualanAtharTable.$inferInsert;
export type NewPembayaranAthar = typeof pembayaranAtharTable.$inferInsert;
export type NewPembayaranHutangAthar =
  typeof pembayaranHutangAtharTable.$inferInsert;
