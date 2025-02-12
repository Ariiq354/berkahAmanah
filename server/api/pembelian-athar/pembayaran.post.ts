import { z } from "zod";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = z.object({
  idPembelian: z.number(),
  tanggal: z.string(),
  nilai: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("ATR", pembelianAtharTable);

  await createPembayaranHutangAthar({
    idPembelian: formData.idPembelian,
    tanggal: formData.tanggal,
    kodeTransaksi,
  });
  await updatePembelianAthar(formData.idPembelian, {
    status: true,
  });

  const commonData = {
    kodeTransaksi,
    tanggal: formData.tanggal,
    keterangan: "Pembayaran Hutang Athar",
  };

  // Debit Bank
  await createTransaksi({
    kodeAkun: "1102",
    anggotaId: user.id,
    nilai: formData.nilai,
    ...commonData,
  });

  // Kredit Hutang Athar
  await createTransaksi({
    kodeAkun: "2101",
    anggotaId: user.id,
    nilai: -formData.nilai,
    ...commonData,
  });

  return;
});
