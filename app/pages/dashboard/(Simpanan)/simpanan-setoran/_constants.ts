import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
  },
  {
    key: "namaLengkap",
    label: "Nama Anggota",
  },
  {
    key: "jenis",
    label: "Jenis Setoran",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "nilai",
    label: "Nilai",
  },
  {
    key: "harga",
    label: "Harga Dasar",
  },
  {
    key: "agio",
    label: "Agio Saham",
  },
  {
    key: "keterangan",
    label: "Keterangan",
  },
  {
    key: "status",
    label: "Status",
  },
];

export const jenisOptions = [
  {
    name: "Pembelian Saham",
    value: "Saham",
  },
  {
    name: "Simpanan Berjangka",
    value: "Simpanan",
  },
];

export function createSchema(min: number = -Infinity) {
  return z.object({
    id: z.number().optional(),
    anggotaId: z.number(),
    keterangan: z.string(),
    nilai: z.number().refine((value) => value >= min, {
      message: `Nilai tidak boleh kurang dari harga saham`,
    }),
    tanggal: z.string(),
    jenis: z.enum(["Saham", "Simpanan"]),
    jumlahSaham: z.number(),
  });
}

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  anggotaId: undefined,
  keterangan: undefined,
  nilai: undefined,
  tanggal: undefined,
  jenis: undefined,
  jumlahSaham: 0,
});

export type Schema = z.output<ReturnType<typeof createSchema>>;
