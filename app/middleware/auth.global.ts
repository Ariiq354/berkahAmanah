import type { UserLucia } from "~~/server/database/schema/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const data: UserLucia = await useRequestFetch()("/api/auth/session");
  if (data) {
    user.value = data;
  }
  const currentRoute = to.fullPath;
  if (!data && currentRoute.includes("/dashboard")) {
    throw createError({
      statusCode: 401,
    });
  }
});
