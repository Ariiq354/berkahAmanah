import { z } from "zod";

const deleteSchema = z.object({
  id: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    deleteSchema.parse(body)
  );

  await deleteUser(formData.id);

  return;
});
