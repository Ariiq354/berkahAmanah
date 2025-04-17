import * as v from "valibot";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = v.object({
  idPenjualan: v.number(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  margin: v.number(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
    kodeAkun: "1102",
    anggotaId: user.id,
    nilai: formData.nilai - formData.margin,
    ...commonData,
  });

  // Kredit Piutang Athar
  await createTransaksi({
    kodeAkun: "1203",
    anggotaId: user.id,
    nilai: -(formData.nilai - formData.margin),
    ...commonData,
  });

  // Debit Pendapatan Athar Ditangguhkan
  await createTransaksi({
    kodeAkun: "1204",
    anggotaId: user.id,
    nilai: formData.margin,
    ...commonData,
  });

  // Kredit Pendapatan Penjualan Athar
  await createTransaksi({
    kodeAkun: "4201",
    anggotaId: user.id,
    nilai: -formData.margin,
    ...commonData,
  });

  return;
});
