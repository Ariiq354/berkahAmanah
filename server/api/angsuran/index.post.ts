import { z } from "zod";
import { pembiayaanTable } from "~~/server/database/schema/pembiayaan";

const bodySchema = z.object({
  pembiayaanId: z.number(),
  keterangan: z.string(),
  jumlah: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const check = await getPembiayaanById(formData.pembiayaanId);
  if (user.role !== "admin" && check?.anggotaId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized",
    });
  }

  const kodeTransaksi = await getTransactionCode("AGS", pembiayaanTable);

  await createAngsuran({
    ...formData,
    kodeTransaksi,
  });

  return;
});
