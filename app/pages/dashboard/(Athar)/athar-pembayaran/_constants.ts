import * as v from "valibot";

export const columns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "jumlahGalon",
    header: "Jumlah Galon",
  },
  {
    accessorKey: "nilai",
    header: "Nilai Transaksi",
  },
  {
    accessorKey: "margin",
    header: "Margin",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

export const schema = v.object({
  idPenjualan: v.optional(v.number()),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  idPenjualan: undefined,
  tanggal: "",
});

export type Schema = v.InferOutput<typeof schema>;
