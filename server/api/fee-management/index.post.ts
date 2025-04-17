import * as v from "valibot";
// import { setoranTable } from "~~/server/database/schema/simpanan";
import { feeManagementTable } from "~~/server/database/schema/transaksi";

const bodySchema = v.object({
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const kodeTransaksi = await getTransactionCode("FEE", feeManagementTable);
  // const kodeTransaksiSetoran = await getTransactionCode("STR", setoranTable);

  await createFeeManagement({
    ...formData,
    kodeTransaksi,
  });

  // await createSetoran({
  //   ...formData,
  //   jenis: "Simpanan",
  //   kodeTransaksi: kodeTransaksiSetoran,
  //   status: 1,
  // });

  return;
});
