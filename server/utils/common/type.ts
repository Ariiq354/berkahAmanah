import * as v from "valibot";

export const OPagination = v.object({
  page: v.optional(v.pipe(v.string(), v.transform(Number)), "1"),
  limit: v.optional(v.pipe(v.string(), v.transform(Number)), "10"),
});

export type TPagination = v.InferOutput<typeof OPagination>;

export type TPaginationMetadata = {
  page: number;
  total: number;
  itemPerPage: number;
};
