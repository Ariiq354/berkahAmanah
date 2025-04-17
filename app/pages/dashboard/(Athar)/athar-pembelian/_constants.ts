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
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const schema = v.object({
  id: v.optional(v.number()),
  jumlahGalon: v.number(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  id: 0,
  jumlahGalon: 0,
  tanggal: "",
});

export type Schema = v.InferOutput<typeof schema>;
