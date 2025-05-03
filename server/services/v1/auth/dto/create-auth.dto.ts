import * as v from "valibot";

export const CreateLoginSchema = v.object({
  email: v.string(),
  password: v.string(),
  rememberMe: v.boolean(),
});

export type CreateLoginDto = v.InferOutput<typeof CreateLoginSchema>;

export const CreateRegisterSchema = v.object({
  email: v.string(),
  namaLengkap: v.string(),
  noTelepon: v.string(),
  password: v.string(),
});

export type CreateRegisterDto = v.InferOutput<typeof CreateRegisterSchema>;
