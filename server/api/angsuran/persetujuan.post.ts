import { z } from "zod";

const bodySchema = z.object({
  angsuranId: z.number(),
  tanggal: z.string(),
  alasan: z.string(),
  setuju: z.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
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
      kodeAkun: "1010200",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: pokok,
    });

    // Kredit Piutang Murabahah
    await createTransaksi({
      ...commonData,
      kodeAkun: "1020101",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: -pokok,
    });

    // Debit pendapatan murabahah ditangguhkan
    await createTransaksi({
      ...commonData,
      kodeAkun: "1020101",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: margin,
    });

    // Kredit pendapatan murabahah
    await createTransaksi({
      ...commonData,
      kodeAkun: "3010101",
      anggotaId: res!.pembiayaan.anggotaId,
      nilai: -margin,
    });
  } else {
    await updateAngsuranStatus(2, formData.angsuranId);
  }

  return;
});
