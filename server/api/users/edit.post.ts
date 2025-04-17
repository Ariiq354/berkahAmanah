import { hash } from "@node-rs/argon2";
import * as v from "valibot";

const bodySchema = v.object({
  password: v.string(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);
  const body = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await updateUser(event.context.user!.id, {
    password: await hash(body.password),
  });

  return;
});
