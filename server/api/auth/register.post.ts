import { hash } from "@node-rs/argon2";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string(),
  namaLengkap: z.string(),
  noTelepon: z.string(),
  password: z.string().min(8),
});

export default eventHandler(async (event) => {
  const formData = await readValidatedBody(event, (e) => bodySchema.parse(e));

  const existingUser = await getUserByEmail(formData.email);
  if (existingUser) {
    return createError({
      message: "Email sudah terpakai",
      statusCode: 401,
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
