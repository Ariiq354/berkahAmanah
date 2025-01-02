import { z } from "zod";

export const columns = [
  {
    key: "namaAkun",
    label: "Nama Akun",
  },
  {
    key: "kodeAkun",
    label: "Kode Akun",
  },
  {
    key: "status",
    label: "Status",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  namaAkun: z.string(),
  kodeAkun: z.string(),
  status: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  namaAkun: undefined,
  kodeAkun: undefined,
  status: true,
});

export type Schema = z.output<typeof schema>;
