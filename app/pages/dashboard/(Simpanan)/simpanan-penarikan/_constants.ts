import * as v from "valibot";

export const columns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "namaLengkap",
    header: "Nama Anggota",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "nilai",
    header: "Nilai",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export function createSchema(max: number = Infinity) {
  return v.object({
    id: v.optional(v.number()),
    anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
    keterangan: v.string(),
    nilai: v.pipe(
      v.number(),
      v.minValue(1, "Required"),
      v.check((value) => value <= max, `Nilai tidak boleh lebih dari saldo`)
    ),
    tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  });
}

export const getInitialFormData = (): Schema => ({
  id: undefined,
  anggotaId: 0,
  keterangan: "",
  nilai: 0,
  tanggal: "",
});

export type Schema = v.InferOutput<ReturnType<typeof createSchema>>;
