import { z } from "zod";
import { pembiayaanTable } from "~~/server/database/schema/pembiayaan";

const bodySchema = z.object({
  pembiayaanId: z.number(),
  keterangan: z.string(),
  jumlah: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("AGS", pembiayaanTable);

  await createAngsuran({
    ...formData,
    kodeTransaksi,
  });

  return;
});
