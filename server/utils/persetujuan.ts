import { db } from "~~/server/database";
import {
  type NewPersetujuanAngsuran,
  type NewPersetujuanPembiayaan,
  type NewPersetujuanPemindahbukuan,
  type NewPersetujuanPenarikan,
  type NewPersetujuanSetoran,
  persetujuanAngsuranTable,
  persetujuanPembiayaanTable,
  persetujuanPemindahbukuanTable,
  persetujuanPenarikanTable,
  persetujuanSetoranTable,
} from "~~/server/database/schema/persetujuan";

export async function createPersetujuanPemindahbukuan(
  data: NewPersetujuanPemindahbukuan
) {
  return await db.insert(persetujuanPemindahbukuanTable).values(data);
}

export async function createPersetujuanPenarikan(
  data: NewPersetujuanPenarikan
) {
  return await db.insert(persetujuanPenarikanTable).values(data);
}

export async function createPersetujuanSetoran(data: NewPersetujuanSetoran) {
  return await db.insert(persetujuanSetoranTable).values(data);
}

export async function createPersetujuanPembiayaan(
  data: NewPersetujuanPembiayaan
) {
  return await db.insert(persetujuanPembiayaanTable).values(data);
}

export async function createPersetujuanAngsuran(data: NewPersetujuanAngsuran) {
  return await db.insert(persetujuanAngsuranTable).values(data);
}
