import * as v from "valibot";

const bodySchema = v.object({
  penarikanId: v.number(),
  alasan: v.string(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await createPersetujuanPenarikan({
    ...formData,
  });

  const res = await getPenarikanById(formData.penarikanId);

  if (formData.setuju) {
    await updatePenarikanStatus(1, formData.penarikanId);

    const commonData = {
      keterangan: res!.keterangan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: res!.tanggal,
    };

    // Kredit Bank
    await createTransaksi({
      ...commonData,
      kodeAkun: "1102",
      anggotaId: res!.anggotaId,
      nilai: -res!.nilai,
    });

    // Debit Simpanan
    await createTransaksi({
      ...commonData,
      kodeAkun: "3102",
      anggotaId: res!.anggotaId,
      nilai: res!.nilai,
    });
  } else {
    await updatePenarikanStatus(2, formData.penarikanId);
  }

  return;
});
