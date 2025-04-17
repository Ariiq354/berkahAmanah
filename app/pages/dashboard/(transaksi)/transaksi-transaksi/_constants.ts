import * as v from "valibot";

export const columns = [
  {
    accessorKey: "kodeTransaksi",
    header: "Kode",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "kodeAkun",
    header: "Kode Akun",
  },
  {
    accessorKey: "namaAkun",
    header: "Nama Akun",
  },
  {
    accessorKey: "nilai",
    header: "Nilai",
  },
  {
    accessorKey: "namaLengkap",
    header: "Nama Anggota",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
];

export const schema = v.object({
  id: v.optional(v.number()),
  kodeAkun: v.pipe(v.string(), v.minLength(1, "Required")),
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.pipe(v.string(), v.minLength(1, "Required")),
  kodeTransaksi: v.pipe(v.string(), v.minLength(1, "Required")),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  id: undefined,
  kodeAkun: "",
  anggotaId: 0,
  keterangan: "",
  kodeTransaksi: "",
  nilai: 0,
  tanggal: "",
});

export type Schema = v.InferOutput<typeof schema>;
