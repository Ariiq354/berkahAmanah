import * as v from "valibot";
import { penjualanAtharTable } from "~~/server/database/schema/athar";

const bodySchema = v.object({
  jumlahGalon: v.number(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  margin: v.number(),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
    kodeAkun: "1203",
    anggotaId: user.id,
    nilai: formData.nilai,
    ...commonData,
  });

  // Kredit Pendapatan Athar Ditangguhkan
  await createTransaksi({
    kodeAkun: "1204",
    anggotaId: user.id,
    nilai: -formData.margin,
    ...commonData,
  });

  // Kredit Persediaan Barang Dagang
  await createTransaksi({
    kodeAkun: "1301",
    anggotaId: user.id,
    nilai: -(formData.nilai - formData.margin),
    ...commonData,
  });

  return;
});
