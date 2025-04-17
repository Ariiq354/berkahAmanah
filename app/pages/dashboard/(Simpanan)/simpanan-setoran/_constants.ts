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
    accessorKey: "jenis",
    header: "Jenis Setoran",
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
    accessorKey: "harga",
    header: "Harga Dasar",
  },
  {
    accessorKey: "agio",
    header: "Agio Saham",
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

export const jenisOptions = [
  {
    name: "Pembelian Saham",
    value: "Saham",
  },
  {
    name: "Simpanan Berjangka",
    value: "Simpanan",
  },
];

export function createSchema(min: number = -Infinity) {
  return v.object({
    id: v.optional(v.number()),
    anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
    keterangan: v.string(),
    nilai: v.pipe(
      v.number(),
      v.minValue(1, "Required"),
      v.check(
        (value) => value >= min,
        `Nilai tidak boleh kurang dari harga saham`
      )
    ),
    tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
    jenis: v.picklist(["Saham", "Simpanan"]),
    jumlahSaham: v.number(),
  });
}

export const getInitialFormData = (): Schema => ({
  id: undefined,
  anggotaId: 0,
  keterangan: "",
  nilai: 0,
  tanggal: "",
  jenis: "Saham",
  jumlahSaham: 0,
});

export type Schema = v.InferOutput<ReturnType<typeof createSchema>>;
