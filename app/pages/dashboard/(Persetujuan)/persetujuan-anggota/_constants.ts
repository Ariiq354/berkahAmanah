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
  {
    key: "select",
    label: "Select",
  },
];

export const schema = z.object({
  id: z.number(),
  status: z.boolean(),
});

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  status: undefined,
});

export type Schema = z.output<typeof schema>;
