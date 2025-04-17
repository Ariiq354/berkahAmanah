import * as v from "valibot";
import { transaksiTable } from "~~/server/database/schema/transaksi";

const bodySchema = v.object({
  kodeAkun: v.string(),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
