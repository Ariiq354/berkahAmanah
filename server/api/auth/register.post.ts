import { hash } from "@node-rs/argon2";
import * as v from "valibot";

const bodySchema = v.object({
  email: v.string(),
  namaLengkap: v.string(),
  noTelepon: v.string(),
  password: v.string(),
});

export default defineEventHandler(async (event) => {
  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
