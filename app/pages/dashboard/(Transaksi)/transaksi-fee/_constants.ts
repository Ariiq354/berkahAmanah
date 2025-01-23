import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode",
  },
  {
    key: "namaLengkap",
    label: "Nama Anggota",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "nilai",
    label: "Nilai",
  },
  {
    key: "keterangan",
    label: "Keterangan",
  },
];

export const schema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  anggotaId: undefined,
  keterangan: undefined,
  nilai: undefined,
  tanggal: undefined,
});

export type Schema = z.output<typeof schema>;
