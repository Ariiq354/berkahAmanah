import { z } from "zod";
import { transaksiTable } from "~~/server/database/schema/transaksi";

const bodySchema = z.object({
  kodeAkun: z.string(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("TRX", transaksiTable);

  const newData = {
    kodeAkun: formData.kodeAkun,
    keterangan: formData.keterangan,
    tanggal: formData.tanggal,
    kodeTransaksi,
    nilai: formData.nilai,
    anggotaId: user.id,
  };

  // Debit New Input
  await createTransaksi(newData);

  //Kredit Bank
  await createTransaksi({
    keterangan: formData.keterangan,
    tanggal: formData.tanggal,
    kodeTransaksi,
    kodeAkun: "1102",
    anggotaId: user.id,
    nilai: -formData.nilai,
  });

  return;
});
