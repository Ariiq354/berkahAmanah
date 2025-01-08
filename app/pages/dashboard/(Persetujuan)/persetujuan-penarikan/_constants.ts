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
    key: "keterangan",
    label: "Keterangan",
  },
  {
    key: "select",
    label: "Select",
  },
];

export const schema = z.object({
  penarikanId: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  penarikanId: undefined,
  alasan: "",
  tanggal: undefined,
});

export type Schema = z.output<typeof schema>;
