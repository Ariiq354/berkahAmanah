import * as v from "valibot";

export const murabahahColumns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "namaLengkap",
    header: "Nama Anggota",
  },
  {
    accessorKey: "tujuan",
    header: "Tujuan Pembiayaan",
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
    accessorKey: "angsuran",
    header: "Angsuran/bulan",
  },
  {
    accessorKey: "sisa",
    header: "Sisa Pembiayaan",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

export const angsuranColumns = [
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
    accessorKey: "status",
    header: "Status",
  },
];

export function createSchema(max: number = Infinity) {
  return v.object({
    pembiayaanId: v.pipe(v.number(), v.minValue(1, "Required")),
    jumlah: v.pipe(
      v.number(),
      v.check((value) => value <= max, "Nilai tidak boleh lebih dari sisa")
    ),
    tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
    keterangan: v.pipe(v.string(), v.minLength(1, "Required")),
  });
}

export const getInitialFormData = (): Schema => ({
  pembiayaanId: 0,
  keterangan: "",
  jumlah: 0,
  tanggal: "",
});

export type Schema = v.InferOutput<ReturnType<typeof createSchema>>;
