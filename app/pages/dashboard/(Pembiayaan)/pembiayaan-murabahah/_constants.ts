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
    key: "jumlah",
    label: "Jumlah Diajukan",
  },
  {
    key: "pokok",
    label: "Pokok",
  },
  {
    key: "margin",
    label: "Margin",
  },
  {
    key: "total",
    label: "Total",
  },
  {
    key: "tempo",
    label: "Tempo",
  },
  {
    key: "status",
    label: "Status",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  anggotaId: z.number(),
  jumlah: z.number(),
  tempo: z.number(),
  tujuan: z.string(),
  catatan: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  anggotaId: undefined,
  catatan: "",
  jumlah: undefined,
  tempo: undefined,
  tujuan: undefined,
});

export type Schema = z.output<typeof schema>;
