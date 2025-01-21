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
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "select",
    label: "Select",
  },
];

export const schema = z.object({
  idPembelian: z.number().optional(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  idPembelian: undefined,
  tanggal: undefined,
});

export type Schema = z.output<typeof schema>;
