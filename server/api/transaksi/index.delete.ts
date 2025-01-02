import { z } from "zod";

const bodySchema = z.object({
  id: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  await deleteTransaksi(formData.id);

  return;
});
