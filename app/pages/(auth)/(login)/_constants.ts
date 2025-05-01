import * as v from "valibot";

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1, "Required"), v.email()),
  password: v.pipe(v.string(), v.minLength(1, "Required")),
  rememberMe: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  email: "",
  password: "",
  rememberMe: false,
});

export type Schema = v.InferOutput<typeof loginSchema>;
