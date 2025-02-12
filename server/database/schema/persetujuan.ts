import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { pemindahbukuanTable, penarikanTable, setoranTable } from "./simpanan";
import { angsuranTable, pembiayaanTable } from "./pembiayaan";

export const persetujuanSetoranTable = sqliteTable("persetujuan_setoran", {
  id: int().primaryKey({ autoIncrement: true }),
  setoranId: int()
    .notNull()
    .references(() => setoranTable.id, { onDelete: "cascade" }),
  alasan: text().notNull(),
  tanggal: text().notNull(),
  setuju: int({ mode: "boolean" }).notNull(),
  ...timestamp,
});

export const persetujuanPenarikanTable = sqliteTable("persetujuan_penarikan", {
  id: int().primaryKey({ autoIncrement: true }),
  penarikanId: int()
    .notNull()
    .references(() => penarikanTable.id, { onDelete: "cascade" }),
  alasan: text().notNull(),
  tanggal: text().notNull(),
  setuju: int({ mode: "boolean" }).notNull(),
  ...timestamp,
});

export const persetujuanPemindahbukuanTable = sqliteTable(
  "persetujuan_pemindahbukuan",
  {
    id: int().primaryKey({ autoIncrement: true }),
    pemindahbukuanId: int()
      .notNull()
      .references(() => pemindahbukuanTable.id, { onDelete: "cascade" }),
    alasan: text().notNull(),
    tanggal: text().notNull(),
    setuju: int({ mode: "boolean" }).notNull(),
    ...timestamp,
  }
);

export const persetujuanPembiayaanTable = sqliteTable(
  "persetujuan_pembiayaan",
  {
    id: int().primaryKey({ autoIncrement: true }),
    pembiayaanId: int()
      .notNull()
      .references(() => pembiayaanTable.id, { onDelete: "cascade" }),
    nilai: int().notNull(),
    jaminan: text().notNull(),
    margin: int().notNull(),
    tanggal: text().notNull(),
    tempo: int().notNull(),
    alasan: text().notNull(),
    setuju: int({ mode: "boolean" }).notNull(),
    ...timestamp,
  }
);

export const persetujuanAngsuranTable = sqliteTable("persetujuan_angsuran", {
  id: int().primaryKey({ autoIncrement: true }),
  angsuranId: int()
    .notNull()
    .references(() => angsuranTable.id, { onDelete: "cascade" }),
  alasan: text().notNull(),
  tanggal: text().notNull(),
  setuju: int({ mode: "boolean" }).notNull(),
  ...timestamp,
});

export const persetujuanSetoranRelations = relations(
  persetujuanSetoranTable,
  ({ one }) => ({
    setoran: one(setoranTable, {
      fields: [persetujuanSetoranTable.setoranId],
      references: [setoranTable.id],
    }),
  })
);
export const persetujuanPenarikanRelations = relations(
  persetujuanPenarikanTable,
  ({ one }) => ({
    penarikan: one(penarikanTable, {
      fields: [persetujuanPenarikanTable.penarikanId],
      references: [penarikanTable.id],
    }),
  })
);
export const persetujuanPemindahbukuanRelations = relations(
  persetujuanPemindahbukuanTable,
  ({ one }) => ({
    pemindahbukuan: one(pemindahbukuanTable, {
      fields: [persetujuanPemindahbukuanTable.pemindahbukuanId],
      references: [pemindahbukuanTable.id],
    }),
  })
);

export const persetujuanPembiayaanRelations = relations(
  persetujuanPembiayaanTable,
  ({ one }) => ({
    pembiayaan: one(pembiayaanTable, {
      fields: [persetujuanPembiayaanTable.pembiayaanId],
      references: [pembiayaanTable.id],
    }),
  })
);
export const persetujuanAngsuranRelations = relations(
  persetujuanAngsuranTable,
  ({ one }) => ({
    angsuran: one(angsuranTable, {
      fields: [persetujuanAngsuranTable.angsuranId],
      references: [angsuranTable.id],
    }),
  })
);

export type NewPersetujuanSetoran = typeof persetujuanSetoranTable.$inferInsert;
export type NewPersetujuanPenarikan =
  typeof persetujuanPenarikanTable.$inferInsert;
export type NewPersetujuanPemindahbukuan =
  typeof persetujuanPemindahbukuanTable.$inferInsert;
export type NewPersetujuanPembiayaan =
  typeof persetujuanPembiayaanTable.$inferInsert;
export type NewPersetujuanAngsuran =
  typeof persetujuanAngsuranTable.$inferInsert;
