import { z } from "zod";

export const murabahahColumns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
  },
  {
    key: "namaLengkap",
    label: "Nama Anggota",
  },
  {
    key: "tujuan",
    label: "Tujuan Pembiayaan",
  },
  {
    key: "pokok",
    label: "Pokok",
  },
  {
    key: "margin",
    label: "Margin",
  },
  {
    key: "total",
    label: "Total",
  },
  {
    key: "tempo",
    label: "Tempo",
  },
  {
    key: "angsuran",
    label: "Angsuran/bulan",
  },
  {
    key: "sisa",
    label: "Sisa Pembiayaan",
  },
  {
    key: "select",
    label: "Select",
  },
];

export const angsuranColumns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
  },
  {
    key: "namaLengkap",
    label: "Nama Anggota",
  },
  {
    key: "noPembiayaan",
    label: "No Pembiayaan",
  },
  {
    key: "jumlah",
    label: "Jumlah Angsuran",
  },
  {
    key: "pokok",
    label: "Pokok",
  },
  {
    key: "margin",
    label: "Margin",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "status",
    label: "Status",
  },
];

export function createSchema(max: number = Infinity) {
  return z.object({
    pembiayaanId: z.number(),
    jumlah: z.number().refine((value) => value <= max, {
      message: `Nilai tidak boleh lebih dari sisa`,
    }),
    tanggal: z.string(),
    keterangan: z.string(),
  });
}

export const getInitialFormData = (): Partial<Schema> => ({
  pembiayaanId: undefined,
  keterangan: "",
  jumlah: undefined,
  tanggal: undefined,
});

export type Schema = z.output<ReturnType<typeof createSchema>>;
