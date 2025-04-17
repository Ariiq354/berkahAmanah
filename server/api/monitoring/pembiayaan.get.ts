import * as v from "valibot";

const querySchema = v.object({
  anggotaId: v.optional(v.pipe(v.string(), v.transform(Number))),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  const res = await getAllPembiayaanByAnggotaId(query.anggotaId);

  const murabahah = res.map((item) => {
    return {
      id: item.id,
      margin: item.margin,
      kodeTransaksi: item.kodeTransaksi,
      tempo: item.tempo,
      tujuan: item.tujuan,
      pokok: item.pokok,
      sisa: item.pokok + item.margin - item.totalAngsuran,
    };
  });

  return murabahah;
});
