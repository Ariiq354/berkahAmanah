import { z } from "zod";

export const galonColumns = [
  {
    key: "price",
    label: "Harga",
  },
  {
    key: "jumlahGalon",
    label: "Jumlah Galon",
  },
  {
    key: "select",
    label: "Select",
  },
];

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
    key: "margin",
    label: "Margin",
  },
  {
    key: "status",
    label: "Status",
  },
];

export function schema(max: number = Infinity) {
  return z.object({
    id: z.number().optional(),
    jumlahGalon: z.number().refine((value) => value <= max, {
      message: `Nilai tidak boleh lebih dari jumlah galon`,
    }),
    tanggal: z.string(),
    nilai: z.number(),
  });
}

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  jumlahGalon: 0,
  tanggal: undefined,
  nilai: 0,
});

export type Schema = z.output<ReturnType<typeof schema>>;
