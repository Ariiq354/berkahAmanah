import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "kodeAkun",
    label: "Kode Akun",
  },
  {
    key: "namaAkun",
    label: "Nama Akun",
  },
  {
    key: "nilai",
    label: "Nilai",
  },
  {
    key: "namaLengkap",
    label: "Nama Anggota",
  },
  {
    key: "keterangan",
    label: "Keterangan",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  akunId: z.number(),
  anggotaId: z.number(),
  keterangan: z.string(),
  kodeTransaksi: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  akunId: undefined,
  anggotaId: undefined,
  keterangan: undefined,
  kodeTransaksi: undefined,
  nilai: undefined,
  tanggal: undefined,
});

export type Schema = z.output<typeof schema>;
