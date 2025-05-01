import * as v from "valibot";
import { OPagination } from "~~/server/utils/common/type";

export const OSetoranList = v.object({
  ...OPagination.entries,
  search: v.optional(v.string()),
});

export type TSetoranList = v.InferOutput<typeof OSetoranList>;
