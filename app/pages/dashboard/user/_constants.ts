import { z } from "zod";

export const columns = [
  {
    key: "namaLengkap",
    label: "Nama Lengkap",
  },
  {
    key: "noTelepon",
    label: "No Telepon",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
];

export const schema = z
  .object({
    id: z.number().optional(),
    username: z.string(),
    password: z.string(),
  })
  .refine(
    (data) => {
      if (!data.id && data.password.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: "Karakter harus 8 atau lebih",
      path: ["password"],
    }
  );

export type Schema = z.output<typeof schema>;

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  username: undefined,
  password: undefined,
});
