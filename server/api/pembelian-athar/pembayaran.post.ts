import * as v from "valibot";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = v.object({
  idPembelian: v.number(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
