import { z } from "zod";

const bodySchema = z.object({
  id: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  await deleteAkun(formData.id);

  return;
});
