import { z } from "zod";
// import { setoranTable } from "~~/server/database/schema/simpanan";
import { feeManagementTable } from "~~/server/database/schema/transaksi";

const bodySchema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
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
