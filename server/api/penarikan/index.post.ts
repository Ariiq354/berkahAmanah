import { z } from "zod";
import { penarikanTable } from "~~/server/database/schema/simpanan";

const bodySchema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
  status: z.boolean(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("TRK", penarikanTable);

  await createPenarikan({
    ...formData,
    kodeTransaksi,
  });

  const commonData = {
    keterangan: formData.keterangan,
    kodeTransaksi,
    tanggal: formData.tanggal,
  };

  // Kredit Bank
  await createTransaksi({
    ...commonData,
    kodeAkun: "1010200",
    anggotaId: formData.anggotaId,
    nilai: -formData.nilai,
  });

  // Debit Simpanan
  await createTransaksi({
    ...commonData,
    kodeAkun: "2010000",
    anggotaId: formData.anggotaId,
    nilai: formData.nilai,
  });

  return;
});
