import * as v from "valibot";

export const OSetoranCreate = v.object({
  anggotaId: v.number(),
  keterangan: v.string(),
  nilai: v.number(),
  tanggal: v.pipe(v.string(), v.isoDate()),
  jenis: v.picklist(["Saham", "Simpanan"]),
  jumlahSaham: v.number(),
});

export type TSetoranCreate = v.InferOutput<typeof OSetoranCreate>;
