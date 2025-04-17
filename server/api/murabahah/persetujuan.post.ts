import * as v from "valibot";

const bodySchema = v.object({
  pembiayaanId: v.number(),
  tempo: v.number(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  jaminan: v.string(),
  margin: v.number(),
  alasan: v.string(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await createPersetujuanPembiayaan({
    ...formData,
  });

  const res = await getPembiayaanById(formData.pembiayaanId);

  if (formData.setuju) {
    await updatePembiayaanStatus(1, formData.pembiayaanId);

    const commonData = {
      keterangan: res!.catatan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: formData.tanggal,
    };

    // Debit Piutang Murabahah
    await createTransaksi({
      ...commonData,
      kodeAkun: "1201",
      anggotaId: res!.anggotaId,
      nilai: formData.nilai + formData.margin,
    });

    // Debit pendapatan murabahah ditangguhkan
    await createTransaksi({
      ...commonData,
      kodeAkun: "1202",
      anggotaId: res!.anggotaId,
      nilai: -formData.margin,
    });

    // Kredit uang muka Pembelian
    await createTransaksi({
      ...commonData,
      kodeAkun: "1303",
      anggotaId: res!.anggotaId,
      nilai: -formData.nilai,
    });
  } else {
    await updatePembiayaanStatus(2, formData.pembiayaanId);
  }

  return;
});
