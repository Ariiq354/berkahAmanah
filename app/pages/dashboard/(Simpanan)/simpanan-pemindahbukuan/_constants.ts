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
    label: "Tujuan",
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
    name: "Anggota Lainnya",
    value: "Anggota",
  },
];

export function createSchema(max: number = Infinity, min: number = 0) {
  return z.object({
    id: z.number().optional(),
    anggotaId: z.number(),
    keterangan: z.string(),
    nilai: z
      .number()
      .min(0)
      .refine((value) => value <= max, {
        message: `Nilai tidak boleh lebih dari saldo`,
      })
      .refine((value) => value >= min, {
        message: `Nilai tidak boleh kurang dari harga saham`,
      }),
    tanggal: z.string(),
    jenis: z.enum(["Saham", "Anggota"]),
    status: z.boolean(),
    noAnggota: z.number(),
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
  status: false,
  jumlahSaham: 0,
  noAnggota: 0,
});

export type Schema = z.output<ReturnType<typeof createSchema>>;
