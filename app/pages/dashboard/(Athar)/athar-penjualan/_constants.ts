import * as v from "valibot";

export const galonColumns = [
  {
    accessorKey: "price",
    header: "Harga",
  },
  {
    accessorKey: "jumlahGalon",
    header: "Jumlah Galon",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

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
    accessorKey: "margin",
    header: "Margin",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export function schema(max: number = Infinity) {
  return v.object({
    id: v.optional(v.number()),
    jumlahGalon: v.pipe(
      v.number(),
      v.check(
        (value) => value <= max,
        `Nilai tidak boleh lebih dari jumlah galon`
      )
    ),
    tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
    nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  });
}

export const getInitialFormData = (): Schema => ({
  id: 0,
  jumlahGalon: 0,
  tanggal: "",
  nilai: 0,
});

export type Schema = v.InferOutput<ReturnType<typeof schema>>;
