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
];

export const schema = v.pipe(
  v.object({
    id: v.optional(v.number()),
    username: v.pipe(v.string(), v.minLength(1, "Required")),
    password: v.pipe(v.string(), v.minLength(1, "Required")),
  }),
  v.forward(
    v.partialCheck([["id"], ["password"]], (data) => {
      if (!data.id && data.password.length < 8) {
        return false;
      }
      return true;
    }),
    ["password"]
  )
);

export type Schema = v.InferOutput<typeof schema>;

export const getInitialFormData = (): Schema => ({
  id: 0,
  username: "",
  password: "",
});
