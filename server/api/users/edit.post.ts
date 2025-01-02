import { hash } from "@node-rs/argon2";
import { z } from "zod";

const bodySchema = z.object({
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);
  const body = await readValidatedBody(event, (body) => bodySchema.parse(body));

  await updateUser(event.context.user!.id, {
    password: await hash(body.password),
  });

  return;
});
