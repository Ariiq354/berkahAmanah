import { z } from "zod";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = z.object({
  idPenjualan: z.number(),
  tanggal: z.string(),
  nilai: z.number(),
  margin: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("ATR", pembelianAtharTable);

  await createPembayaranAthar({
    idPenjualan: formData.idPenjualan,
    tanggal: formData.tanggal,
    kodeTransaksi,
  });
  await updatePenjualanAthar(formData.idPenjualan, {
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
    nilai: formData.nilai - formData.margin,
    ...commonData,
  });

  // Kredit Piutang Athar
  await createTransaksi({
    kodeAkun: "1020300",
    anggotaId: user.id,
    nilai: -(formData.nilai - formData.margin),
    ...commonData,
  });

  // Debit Pendapatan Athar Ditangguhkan
  await createTransaksi({
    kodeAkun: "1020301",
    anggotaId: user.id,
    nilai: formData.margin,
    ...commonData,
  });

  // Kredit Pendapatan Penjualan Athar
  await createTransaksi({
    kodeAkun: "3010102",
    anggotaId: user.id,
    nilai: -formData.margin,
    ...commonData,
  });

  return;
});
