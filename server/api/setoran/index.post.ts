import { z } from "zod";
import { setoranTable } from "~~/server/database/schema/simpanan";

const bodySchema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
  jenis: z.enum(["Saham", "Simpanan"]),
  jumlahSaham: z.number(),
  status: z.boolean(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("STR", setoranTable);

  await createSetoran({
    ...formData,
    kodeTransaksi,
  });

  const commonData = {
    keterangan: formData.keterangan,
    kodeTransaksi,
    tanggal: formData.tanggal,
  };

  // Debit Bank
  await createTransaksi({
    ...commonData,
    kodeAkun: "1010200",
    anggotaId: formData.anggotaId,
    nilai: formData.nilai,
  });

  if (formData.jenis === "Simpanan") {
    // Kredit Simpanan
    await createTransaksi({
      ...commonData,
      kodeAkun: "2010000",
      anggotaId: formData.anggotaId,
      nilai: -formData.nilai,
    });
  } else {
    // Kredit Saham
    await createTransaksi({
      ...commonData,
      kodeAkun: "2020200",
      anggotaId: formData.anggotaId,
      nilai: -formData.nilai,
    });
  }

  return;
});
