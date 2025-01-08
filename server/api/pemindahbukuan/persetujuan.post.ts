import { z } from "zod";

const bodySchema = z.object({
  pemindahbukuanId: z.number(),
  setoranId: z.number(),
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

  await createPersetujuanPemindahbukuan({
    ...formData,
  });

  const res = await getPemindahbukuanById(formData.pemindahbukuanId);

  if (formData.setuju) {
    await updatePemindahbukuanStatus(1, formData.pemindahbukuanId);
    await updateSetoranStatus(1, formData.setoranId);
    await updatePenarikanStatus(1, formData.penarikanId);

    const commonDataTransaksi = {
      keterangan: res!.keterangan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: res!.tanggal,
    };

    if (res!.jenis === "Anggota") {
      // Debit Simpanan A
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "2010000",
        anggotaId: res!.anggotaId,
        nilai: res!.nilai,
      });

      // Kredit Simpanan B
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "2010000",
        anggotaId: res!.setoran.anggotaId,
        nilai: -res!.nilai,
      });
    } else {
      // Debit Simpanan
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "2010000",
        anggotaId: res!.anggotaId,
        nilai: res!.nilai,
      });

      // Kredit Saham
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "2020200",
        anggotaId: res!.setoran.anggotaId,
        nilai: -res!.nilai,
      });
    }
  } else {
    await updatePemindahbukuanStatus(2, formData.pemindahbukuanId);
    await updateSetoranStatus(2, formData.setoranId);
    await updatePenarikanStatus(2, formData.penarikanId);
  }

  return;
});
