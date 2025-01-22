import { z } from "zod";
import { penarikanTable } from "~~/server/database/schema/simpanan";

const bodySchema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("TRK", penarikanTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  await createPenarikan({
    ...formData,
    kodeTransaksi,
  });

  return;
});
