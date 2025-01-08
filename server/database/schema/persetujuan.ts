import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { pemindahbukuanTable, penarikanTable, setoranTable } from "./simpanan";

export const persetujuanSetoranTable = sqliteTable("persetujuan_setoran", {
  id: int().primaryKey({ autoIncrement: true }),
  setoranId: int()
    .notNull()
    .references(() => setoranTable.id),
  alasan: text().notNull(),
  tanggal: text().notNull(),
  setuju: int({ mode: "boolean" }).notNull(),
  ...timestamp,
});

export const persetujuanPenarikanTable = sqliteTable("persetujuan_penarikan", {
  id: int().primaryKey({ autoIncrement: true }),
  penarikanId: int()
    .notNull()
    .references(() => penarikanTable.id),
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
      .references(() => pemindahbukuanTable.id),
    alasan: text().notNull(),
    tanggal: text().notNull(),
    setuju: int({ mode: "boolean" }).notNull(),
    ...timestamp,
  }
);

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

export type NewPersetujuanSetoran = typeof persetujuanSetoranTable.$inferInsert;
export type NewPersetujuanPenarikan =
  typeof persetujuanPenarikanTable.$inferInsert;
export type NewPersetujuanPemindahbukuan =
  typeof persetujuanPemindahbukuanTable.$inferInsert;
