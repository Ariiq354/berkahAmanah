import { z } from "zod";

const bodySchema = z.object({
  id: z.number(),
  status: z.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");
  const body = await readValidatedBody(event, (body) => bodySchema.parse(body));

  if (body.status) {
    await updateUser(body.id, {
      status: true,
    });
  } else {
    await deleteUser([body.id]);
  }

  return;
});
