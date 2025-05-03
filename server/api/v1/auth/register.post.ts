import { hash } from "@node-rs/argon2";
import * as v from "valibot";
import { CreateRegisterSchema } from "~~/server/services/v1/auth/dto/create-auth.dto";

export default defineEventHandler(async (event) => {
  const formData = await readValidatedBody(event, (body) =>
    v.parse(CreateRegisterSchema, body)
  );

  const existingUser = await getUserByEmail(formData.email);
  if (existingUser) {
    return createError({
      message: "Email sudah terpakai",
      statusCode: 400,
    });
  }

  const hashedPassword = await hash(formData.password);
  const randomNumber = await generateRandomNumber();

  await createUser({
    ...formData,
    noUser: randomNumber,
    password: hashedPassword,
  });
});
