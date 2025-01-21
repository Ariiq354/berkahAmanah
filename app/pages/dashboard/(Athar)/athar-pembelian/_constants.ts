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
    key: "status",
    label: "Status",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  jumlahGalon: z.number(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  jumlahGalon: 0,
  tanggal: undefined,
});

export const HARGA_ATHAR = 6000;

export type Schema = z.output<typeof schema>;
