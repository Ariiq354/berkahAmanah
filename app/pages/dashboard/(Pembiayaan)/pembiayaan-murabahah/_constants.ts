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
    accessorKey: "jumlah",
    header: "Jumlah Diajukan",
  },
  {
    accessorKey: "pokok",
    header: "Pokok",
  },
  {
    accessorKey: "margin",
    header: "Margin",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "tempo",
    header: "Tempo",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const schema = v.object({
  id: v.optional(v.number()),
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  jumlah: v.pipe(v.number(), v.minValue(1, "Required")),
  tempo: v.pipe(v.number(), v.minValue(1, "Required")),
  tujuan: v.pipe(v.string(), v.minLength(1, "Required")),
  catatan: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  id: undefined,
  anggotaId: 0,
  catatan: "",
  jumlah: 0,
  tempo: 0,
  tujuan: "",
});

export type Schema = v.InferOutput<typeof schema>;
