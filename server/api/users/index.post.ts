import { hash } from "@node-rs/argon2";
import { z } from "zod";

const userSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  isActive: z.boolean(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    userSchema.parse(body)
  );

  const exist = await getUserByUsername(formData.username);
  if (formData.id) {
    if (exist && exist.id !== formData.id) {
      throw createError({
        statusCode: 401,
        message: "Username sudah ada",
      });
    }

    const itemData = {
      id: formData.id,
      username: formData.username,
      isActive: formData.isActive,
    };

    await updateUser(formData.id, itemData);
  } else {
    if (exist) {
      throw createError({
        statusCode: 401,
        message: "Username sudah ada",
      });
    }
    const newData = {
      ...formData,
      password: await hash(formData.password),
    };
    await createUser(newData);
  }

  return;
});
