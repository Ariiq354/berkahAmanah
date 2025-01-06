import { z } from "zod";

export const columns = [
  {
    key: "nilai",
    label: "Nilai",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  nilai: z.number(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  nilai: undefined,
});

export type Schema = z.output<typeof schema>;
