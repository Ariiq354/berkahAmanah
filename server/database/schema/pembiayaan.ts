import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { relations } from "drizzle-orm";
import { userTable } from "./auth";
import { persetujuanPembiayaanTable } from "./persetujuan";

export const pembiayaanTable = sqliteTable("pembiayaan", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  jumlah: int().notNull(),
  tempo: int().notNull(),
  tujuan: text().notNull(),
  catatan: text().notNull(),
  status: int().notNull().default(0),
  ...timestamp,
});

export const angsuranTable = sqliteTable("angsuran", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
  pembiayaanId: int()
    .notNull()
    .references(() => pembiayaanTable.id),
  jumlah: int().notNull(),
  keterangan: text().notNull(),
  status: int().notNull().default(0),
  ...timestamp,
});

export const pembiayaanRelations = relations(pembiayaanTable, ({ one }) => ({
  anggota: one(userTable, {
    fields: [pembiayaanTable.anggotaId],
    references: [userTable.id],
  }),
  persetujuan: one(persetujuanPembiayaanTable, {
    fields: [pembiayaanTable.id],
    references: [persetujuanPembiayaanTable.pembiayaanId],
  }),
}));

export const angsuranRelations = relations(angsuranTable, ({ one }) => ({
  pembiayaan: one(pembiayaanTable, {
    fields: [angsuranTable.pembiayaanId],
    references: [pembiayaanTable.id],
  }),
}));

export type NewPembiayaan = typeof pembiayaanTable.$inferInsert;
export type NewAngsuran = typeof angsuranTable.$inferInsert;
