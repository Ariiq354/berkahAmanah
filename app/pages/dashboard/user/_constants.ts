import { z } from "zod";

export const columns = [
  {
    key: "username",
    label: "Username",
    sortable: true,
  },
  {
    key: "isActive",
    label: "Status",
  },
];

export const schema = z
  .object({
    id: z.number().optional(),
    username: z.string(),
    password: z.string(),
    isActive: z.boolean(),
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
  isActive: false,
});
