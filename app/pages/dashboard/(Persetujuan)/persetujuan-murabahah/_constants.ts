import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
  },
  {
    key: "jumlah",
    label: "Jumlah Diajukan",
  },
  {
    key: "tempo",
    label: "tempo",
  },
  {
    key: "tujuan",
    label: "Tujuan Pengajuan",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
  {
    key: "select",
    label: "Select",
  },
];

export const jaminanOptions = [
  "Tidak Ada",
  "Ada",
  "Belum Diserahkan",
  "Dipinjam",
  "Sudah Dikembalikan",
];

export const schema = z.object({
  pembiayaanId: z.number(),
  tempo: z.number(),
  nilai: z.number(),
  jaminan: z.string(),
  margin: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  pembiayaanId: undefined,
  alasan: "",
  nilai: undefined,
  margin: undefined,
  tanggal: undefined,
  tempo: undefined,
  jaminan: undefined,
  setuju: undefined,
});

export type Schema = z.output<typeof schema>;
