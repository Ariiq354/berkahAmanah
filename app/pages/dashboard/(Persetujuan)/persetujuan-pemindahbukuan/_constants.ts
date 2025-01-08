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
    key: "select",
    label: "Select",
  },
];

export const schema = z.object({
  pemindahbukuanId: z.number(),
  penarikanId: z.number(),
  setoranId: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  pemindahbukuanId: undefined,
  penarikanId: undefined,
  setoranId: undefined,
  alasan: "",
  tanggal: undefined,
  setuju: undefined,
});

export type Schema = z.output<typeof schema>;
