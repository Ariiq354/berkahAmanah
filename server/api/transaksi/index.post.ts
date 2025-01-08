import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  kodeAkun: z.string(),
  anggotaId: z.number(),
  keterangan: z.string(),
  kodeTransaksi: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateTransaksi(formData.id, formData);
  } else {
    await createTransaksi(formData);
  }

  return;
});
