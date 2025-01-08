import { z } from "zod";
import { setoranTable } from "~~/server/database/schema/simpanan";

const bodySchema = z.object({
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
  jenis: z.enum(["Saham", "Simpanan"]),
  jumlahSaham: z.number(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeTransaksi = await getTransactionCode("STR", setoranTable);

  await createSetoran({
    ...formData,
    kodeTransaksi,
  });

  return;
});
