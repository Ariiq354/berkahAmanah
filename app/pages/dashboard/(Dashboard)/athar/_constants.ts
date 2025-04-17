import type { TableColumn } from "@nuxt/ui";
import * as v from "valibot";

export const columns: TableColumn<unknown, unknown>[] = [
  {
    accessorKey: "nilai",
    header: "Nilai",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
];

export const schema = v.object({
  id: v.optional(v.number()),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
});

export const getInitialFormData = (): Schema => ({
  id: undefined,
  nilai: 0,
});

export type Schema = v.InferOutput<typeof schema>;
