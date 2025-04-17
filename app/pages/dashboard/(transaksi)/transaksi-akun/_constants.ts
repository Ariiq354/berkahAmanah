import * as v from "valibot";

export const columns = [
  {
    accessorKey: "namaAkun",
    header: "Nama Akun",
  },
  {
    accessorKey: "kodeAkun",
    header: "Kode Akun",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const schema = v.object({
  id: v.optional(v.number()),
  namaAkun: v.string(),
  kodeAkun: v.string(),
  status: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  id: 0,
  namaAkun: "",
  kodeAkun: "",
  status: true,
});

export type Schema = v.InferOutput<typeof schema>;
