import * as v from "valibot";

const bodySchema = v.object({
  pemindahbukuanId: v.number(),
  setoranId: v.number(),
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
        kodeAkun: "3102",
        anggotaId: res!.anggotaId,
        nilai: res!.nilai,
      });

      // Kredit Simpanan B
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "3102",
        anggotaId: res!.setoran.anggotaId,
        nilai: -res!.nilai,
      });
    } else {
      // Debit Simpanan
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "3102",
        anggotaId: res!.anggotaId,
        nilai: res!.nilai,
      });

      // Kredit Saham
      await createTransaksi({
        ...commonDataTransaksi,
        kodeAkun: "3101",
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
