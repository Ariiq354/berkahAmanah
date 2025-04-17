import * as v from "valibot";

export const loginSchema = v.object({
  namaLengkap: v.pipe(v.string(), v.minLength(1, "Required")),
  noTelepon: v.pipe(v.string(), v.minLength(1, "Required")),
  email: v.pipe(v.string(), v.minLength(1, "Required"), v.email()),
  password: v.pipe(v.string(), v.minLength(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  email: "",
  password: "",
  noTelepon: "",
  namaLengkap: "",
});

export type Schema = v.InferOutput<typeof loginSchema>;
