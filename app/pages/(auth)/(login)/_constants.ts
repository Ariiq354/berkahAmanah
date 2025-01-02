import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8, "Harus terdiri dari setidaknya 8 karakter."),
  rememberMe: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  email: undefined,
  password: undefined,
  rememberMe: false,
});

export type Schema = z.output<typeof loginSchema>;
