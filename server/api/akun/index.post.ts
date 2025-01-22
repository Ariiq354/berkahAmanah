import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  kodeAkun: z.string(),
  namaAkun: z.string(),
  status: z.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateAkun(formData.id, formData);
  } else {
    await createAkun(formData);
  }

  return;
});
