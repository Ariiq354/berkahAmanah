import { z } from "zod";

const bodySchema = z
  .object({
    anggotaId: z.number(),
    sumSetoran: z.number(),
    sumSaham: z.number(),
    tahun: z.number(),
  })
  .array();

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  await createShu(formData);

  return;
});
