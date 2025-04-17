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
    accessorKey: "noPembiayaan",
    header: "No Pembiayaan",
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah Angsuran",
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
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

export const schema = v.object({
  angsuranId: v.pipe(v.number(), v.minValue(1, "Required")),
  alasan: v.pipe(v.string(), v.minLength(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  angsuranId: 0,
  alasan: "",
  tanggal: "",
  setuju: false,
});

export type Schema = v.InferOutput<typeof schema>;
