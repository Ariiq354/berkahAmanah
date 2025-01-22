import { z } from "zod";

const bodySchema = z.object({
  pembiayaanId: z.number(),
  tempo: z.number(),
  nilai: z.number(),
  jaminan: z.string(),
  margin: z.number(),
  alasan: z.string(),
  tanggal: z.string(),
  setuju: z.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
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
      kodeAkun: "1020100",
      anggotaId: res!.anggotaId,
      nilai: formData.nilai + formData.margin,
    });

    // Debit pendapatan murabahah ditangguhkan
    await createTransaksi({
      ...commonData,
      kodeAkun: "1020101",
      anggotaId: res!.anggotaId,
      nilai: -formData.margin,
    });

    // Kredit uang muka Pembelian
    await createTransaksi({
      ...commonData,
      kodeAkun: "1030101",
      anggotaId: res!.anggotaId,
      nilai: -formData.nilai,
    });
  } else {
    await updatePembiayaanStatus(2, formData.pembiayaanId);
  }

  return;
});
