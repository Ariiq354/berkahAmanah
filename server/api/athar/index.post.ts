import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  nilai: z.number(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateAthar(formData.id, formData);
  } else {
    await createAthar(formData);
  }

  return;
});
