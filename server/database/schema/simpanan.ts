import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { relations } from "drizzle-orm";
import { userTable } from "./auth";

export const setoranTable = sqliteTable("setoran", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  jenis: text({ enum: ["Saham", "Simpanan"] }).notNull(),
  nilai: int().notNull(),
  tanggal: text().notNull(),
  jumlahSaham: int().notNull().default(0),
  keterangan: text().notNull(),
  status: int().notNull().default(0),
  ...timestamp,
});

export const penarikanTable = sqliteTable("penarikan", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  nilai: int().notNull(),
  keterangan: text().notNull(),
  status: int().notNull().default(0),
  ...timestamp,
});

export const pemindahbukuanTable = sqliteTable("pemindahbukuan", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  anggotaId: int()
    .notNull()
    .references(() => userTable.id),
  nilai: int().notNull(),
  jenis: text({ enum: ["Saham", "Anggota"] }).notNull(),
  tanggal: text().notNull(),
  keterangan: text().notNull(),
  status: int().notNull().default(0),
  idSetoran: int()
    .notNull()
    .references(() => setoranTable.id),
  idPenarikan: int()
    .notNull()
    .references(() => penarikanTable.id),
  ...timestamp,
});

export const setoranRelations = relations(setoranTable, ({ one }) => ({
  anggota: one(userTable, {
    fields: [setoranTable.anggotaId],
    references: [userTable.id],
  }),
}));

export const penarikanRelations = relations(penarikanTable, ({ one }) => ({
  anggota: one(userTable, {
    fields: [penarikanTable.anggotaId],
    references: [userTable.id],
  }),
}));

export const pemindahbukuanRelations = relations(
  pemindahbukuanTable,
  ({ one }) => ({
    anggota: one(userTable, {
      fields: [pemindahbukuanTable.anggotaId],
      references: [userTable.id],
    }),
    setoran: one(setoranTable, {
      fields: [pemindahbukuanTable.idSetoran],
      references: [setoranTable.id],
    }),
  })
);

export type NewSetoran = typeof setoranTable.$inferInsert;
export type NewPenarikan = typeof penarikanTable.$inferInsert;
export type NewPemindahbukuan = typeof pemindahbukuanTable.$inferInsert;
