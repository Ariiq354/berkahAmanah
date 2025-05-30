import { verify } from "@node-rs/argon2";
import * as v from "valibot";

const bodySchema = v.object({
  email: v.string(),
  password: v.string(),
  rememberMe: v.boolean(),
});

export default defineEventHandler(async (event) => {
  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const existingUser = await getUserByEmail(formData.email);

  if (!existingUser) {
    return createError({
      message: "Email atau password salah",
      statusCode: 400,
    });
  }

  const validPassword = await verify(existingUser.password, formData.password);

  if (!validPassword) {
    return createError({
      message: "Email atau password salah",
      statusCode: 400,
    });
  }

  const session = await createSession(existingUser.id);
  if (formData.rememberMe) {
    await extendSession(session.id, 1000 * 60 * 60 * 24 * 7);
  }
  setSessionTokenCookie(event, session.id, session.expiresAt);
});
