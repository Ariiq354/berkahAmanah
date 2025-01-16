import { z } from "zod";

const querySchema = z.object({
  pembiayaanId: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (q) => querySchema.parse(q));

  const res = await getAllAngsuranByPembiayaanId(query.pembiayaanId);

  const angsuran = res.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      tanggal: item.tanggal,
      noPembiayaan: item.noPembiayaan,
      jumlah: item.jumlah,
      pembiayaanId: item.pembiayaanId,
      pokok:
        (item.jumlah * item.nilaiSetuju) /
        (item.nilaiSetuju + item.marginSetuju),
      margin:
        (item.jumlah * item.marginSetuju) /
        (item.nilaiSetuju + item.marginSetuju),
    };
  });

  return angsuran;
});
