import { z } from "zod";

const bodySchema = z.object({
  setoranId: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  await createPersetujuanSetoran({
    ...formData,
  });

  const res = await getSetoranById(formData.setoranId);

  if (formData.setuju) {
    await updateSetoranStatus(1, formData.setoranId);

    const commonData = {
      keterangan: res!.keterangan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: res!.tanggal,
    };

    // Debit Bank
    await createTransaksi({
      ...commonData,
      kodeAkun: "1010200",
      anggotaId: res!.anggotaId,
      nilai: res!.nilai,
    });

    if (res!.jenis === "Simpanan") {
      // Kredit Simpanan
      await createTransaksi({
        ...commonData,
        kodeAkun: "2010000",
        anggotaId: res!.anggotaId,
        nilai: -res!.nilai,
      });
    } else {
      // Kredit Saham
      await createTransaksi({
        ...commonData,
        kodeAkun: "2020200",
        anggotaId: res!.anggotaId,
        nilai: -res!.nilai,
      });
    }
  } else {
    await updateSetoranStatus(2, formData.setoranId);
  }

  return;
});
