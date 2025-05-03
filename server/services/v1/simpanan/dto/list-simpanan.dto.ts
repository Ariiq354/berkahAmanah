import * as v from "valibot";

export const OSaldoSimpanan = v.object({
  anggotaId: v.pipe(v.string(), v.transform(Number)),
});

export type TSaldoSimpanan = v.InferOutput<typeof OSaldoSimpanan>;
