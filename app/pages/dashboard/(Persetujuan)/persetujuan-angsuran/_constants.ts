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
    key: "noPembiayaan",
    label: "No Pembiayaan",
  },
  {
    key: "jumlah",
    label: "Jumlah Angsuran",
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
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "select",
    label: "Select",
  },
];

export const schema = z.object({
  angsuranId: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  angsuranId: undefined,
  alasan: "",
  tanggal: undefined,
  setuju: undefined,
});

export type Schema = z.output<typeof schema>;
