import { verify } from "@node-rs/argon2";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export default eventHandler(async (event) => {
  const formData = await readValidatedBody(event, (e) => bodySchema.parse(e));

  const existingUser = await getUserByEmail(formData.email);

  if (!existingUser) {
    return createError({
      message: "Email atau password salah",
      statusCode: 401,
    });
  }

  const validPassword = await verify(existingUser.password, formData.password);

  if (!validPassword) {
    return createError({
      message: "Email atau password salah",
      statusCode: 401,
    });
  }

  const session = await createSession(existingUser.id);
  if (formData.rememberMe) {
    await extendSession(session.id, 1000 * 60 * 60 * 24 * 7);
  }
  setSessionTokenCookie(event, session.id, session.expiresAt);

  return {
    authSession: session.id,
    user: existingUser.id,
  };
});
