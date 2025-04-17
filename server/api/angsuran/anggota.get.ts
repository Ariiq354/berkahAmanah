import * as v from "valibot";

const querySchema = v.object({
  pembiayaanId: v.pipe(v.string(), v.transform(Number)),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  let res;
  if (user.role !== "admin") {
    res = await getAllAngsuranByPembiayaanId(query.pembiayaanId, user.id);
  } else {
    res = await getAllAngsuranByPembiayaanId(query.pembiayaanId);
  }

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
