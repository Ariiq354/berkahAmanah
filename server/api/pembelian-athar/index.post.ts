import { z } from "zod";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = z.object({
  jumlahGalon: z.number(),
  nilai: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("ATR", pembelianAtharTable);

  await createPembelianAthar({
    ...formData,
    kodeTransaksi,
  });

  const commonData = {
    kodeTransaksi,
    tanggal: formData.tanggal,
    keterangan: "Pembelian Athar",
  };

  // Debit Persediaan Barang Dagang
  await createTransaksi({
    kodeAkun: "1301",
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
