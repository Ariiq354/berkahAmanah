import { z } from "zod";

const querySchema = z.object({
  anggotaId: z.coerce.number().optional(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const query = await getValidatedQuery(event, (q) => querySchema.parse(q));

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
