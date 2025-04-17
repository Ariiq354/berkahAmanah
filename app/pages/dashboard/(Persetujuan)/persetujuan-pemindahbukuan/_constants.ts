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
    header: "Tujuan",
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
    accessorKey: "select",
    header: "Select",
  },
];

export const schema = v.object({
  pemindahbukuanId: v.number(),
  penarikanId: v.number(),
  setoranId: v.number(),
  alasan: v.string(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  pemindahbukuanId: 0,
  penarikanId: 0,
  setoranId: 0,
  alasan: "",
  tanggal: "",
  setuju: false,
});

export type Schema = v.InferOutput<typeof schema>;
