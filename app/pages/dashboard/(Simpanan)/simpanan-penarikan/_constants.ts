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

export function createSchema(max: number = Infinity) {
  return z.object({
    id: z.number().optional(),
    anggotaId: z.number(),
    keterangan: z.string(),
    nilai: z
      .number()
      .min(0)
      .refine((value) => value <= max, {
        message: `Nilai tidak boleh lebih dari saldo`,
      }),
    tanggal: z.string(),
    status: z.boolean(),
  });
}

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  anggotaId: undefined,
  keterangan: undefined,
  nilai: undefined,
  tanggal: undefined,
  status: true,
});

export type Schema = z.output<ReturnType<typeof createSchema>>;
