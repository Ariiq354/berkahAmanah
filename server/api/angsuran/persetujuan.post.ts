import * as v from "valibot";

const bodySchema = v.object({
  angsuranId: v.number(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  alasan: v.string(),
  setuju: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await createPersetujuanAngsuran({
    ...formData,
  });

  const res = await getAngsuranById(formData.angsuranId);

  if (formData.setuju) {
    await updateAngsuranStatus(1, formData.angsuranId);

    const commonData = {
      keterangan: res!.keterangan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: formData.tanggal,
    };

    const pokok =
      (res!.jumlah * res!.pembiayaan.persetujuan.nilai) /
      (res!.pembiayaan.persetujuan.nilai + res!.pembiayaan.persetujuan.margin);
    const margin =
      (res!.jumlah * res!.pembiayaan.persetujuan.margin) /
      (res!.pembiayaan.persetujuan.nilai + res!.pembiayaan.persetujuan.margin);

    // Debit Bank
    await createTransaksi({
      ...commonData,
      kodeAkun: "1102",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: pokok,
    });

    // Kredit Piutang Murabahah
    await createTransaksi({
      ...commonData,
      kodeAkun: "1201",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: -pokok,
    });

    // Debit pendapatan murabahah ditangguhkan
    await createTransaksi({
      ...commonData,
      kodeAkun: "1202",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: margin,
    });

    // Kredit pendapatan murabahah
    await createTransaksi({
      ...commonData,
      kodeAkun: "4101",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: -margin,
    });
  } else {
    await updateAngsuranStatus(2, formData.angsuranId);
  }

  return;
});
