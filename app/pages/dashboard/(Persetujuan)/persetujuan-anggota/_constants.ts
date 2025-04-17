import * as v from "valibot";

export const columns = [
  {
    accessorKey: "namaLengkap",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "noTelepon",
    header: "No Telepon",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "select",
    header: "Select",
  },
];

export const schema = v.object({
  id: v.number(),
  status: v.boolean(),
});

export const getInitialFormData = (): Schema => ({
  id: 0,
  status: false,
});

export type Schema = v.InferOutput<typeof schema>;
