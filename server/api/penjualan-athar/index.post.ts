import { z } from "zod";
import { penjualanAtharTable } from "~~/server/database/schema/athar";

const bodySchema = z.object({
  jumlahGalon: z.number(),
  nilai: z.number(),
  tanggal: z.string(),
  margin: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("ATR", penjualanAtharTable);

  await createPenjualanAthar({
    ...formData,
    kodeTransaksi,
  });

  const commonData = {
    kodeTransaksi,
    tanggal: formData.tanggal,
    keterangan: "Penjualan Athar",
  };

  // Debit Piutang Athar
  await createTransaksi({
    kodeAkun: "1020300",
    anggotaId: user.id,
    nilai: formData.nilai,
    ...commonData,
  });

  // Kredit Pendapatan Athar Ditangguhkan
  await createTransaksi({
    kodeAkun: "1020301",
    anggotaId: user.id,
    nilai: -formData.margin,
    ...commonData,
  });

  // Kredit Persediaan Barang Dagang
  await createTransaksi({
    kodeAkun: "1030100",
    anggotaId: user.id,
    nilai: -(formData.nilai - formData.margin),
    ...commonData,
  });

  return;
});
