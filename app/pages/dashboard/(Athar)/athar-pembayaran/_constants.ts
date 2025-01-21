import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
  },
  {
    key: "jumlahGalon",
    label: "Jumlah Galon",
  },
  {
    key: "nilai",
    label: "Nilai Transaksi",
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
  idPenjualan: z.number().optional(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  idPenjualan: undefined,
  tanggal: undefined,
});

export type Schema = z.output<typeof schema>;
