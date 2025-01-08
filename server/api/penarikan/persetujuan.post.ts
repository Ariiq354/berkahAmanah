import { z } from "zod";

const bodySchema = z.object({
  penarikanId: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
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
      kodeAkun: "1010200",
      anggotaId: res!.anggotaId,
      nilai: -res!.nilai,
    });

    // Debit Simpanan
    await createTransaksi({
      ...commonData,
      kodeAkun: "2010000",
      anggotaId: res!.anggotaId,
      nilai: res!.nilai,
    });
  } else {
    await updatePenarikanStatus(2, formData.penarikanId);
  }

  return;
});
