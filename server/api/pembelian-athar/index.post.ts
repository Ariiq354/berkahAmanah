import * as v from "valibot";
import { pembelianAtharTable } from "~~/server/database/schema/athar";

const bodySchema = v.object({
  jumlahGalon: v.number(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  const user = resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
