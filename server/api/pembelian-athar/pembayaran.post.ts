import { z } from "zod";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = z.object({
  idPembelian: z.number(),
  tanggal: z.string(),
  nilai: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

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
    kodeAkun: "1010200",
    anggotaId: user.id,
    nilai: formData.nilai,
    ...commonData,
  });

  // Kredit Hutang Athar
  await createTransaksi({
    kodeAkun: "2011001",
    anggotaId: user.id,
    nilai: -formData.nilai,
    ...commonData,
  });

  return;
});
