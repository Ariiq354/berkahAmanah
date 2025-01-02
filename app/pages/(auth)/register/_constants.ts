import { z } from "zod";

export const loginSchema = z.object({
  namaLengkap: z.string(),
  noTelepon: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Harus terdiri dari setidaknya 8 karakter."),
});

export const getInitialFormData = (): Partial<Schema> => ({
  email: undefined,
  password: undefined,
  noTelepon: undefined,
  namaLengkap: undefined,
});

export type Schema = z.output<typeof loginSchema>;
