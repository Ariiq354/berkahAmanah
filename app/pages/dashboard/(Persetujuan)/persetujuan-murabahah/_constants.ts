import * as v from "valibot";

export const columns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah Diajukan",
  },
  {
    accessorKey: "tempo",
    header: "tempo",
  },
  {
    accessorKey: "tujuan",
    header: "Tujuan Pengajuan",
  },
  {
    accessorKey: "catatan",
    header: "Catatan",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

export const jaminanOptions = [
  "Tidak Ada",
  "Ada",
  "Belum Diserahkan",
  "Dipinjam",
  "Sudah Dikembalikan",
];

export const schema = v.object({
  pembiayaanId: v.pipe(v.number(), v.minValue(1, "Required")),
  tempo: v.number(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  jaminan: v.pipe(v.string(), v.minLength(1, "Required")),
  margin: v.number(),
  alasan: v.pipe(v.string(), v.minLength(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  pembiayaanId: 0,
  alasan: "",
  nilai: 0,
  margin: 0,
  tanggal: "",
  tempo: 0,
  jaminan: "",
  setuju: false,
});

export type Schema = v.InferOutput<typeof schema>;
