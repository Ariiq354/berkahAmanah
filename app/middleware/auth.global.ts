import type { UserLucia } from "~~/server/database/schema/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  //@ts-ignore
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

  if (data) {
    const routePermissions: string[] = [
      "/dashboard/athar",
      "/dashboard/saham",
      "/dashboard/keuangan",
      "/dashboard/monitoring",
      "/dashboard/persetujuan",
      "/dashboard/transaksi",
    ];

    for (const route of routePermissions) {
      if (currentRoute.includes(route) && data.role !== "admin") {
        await navigateTo("/dashboard");
        break;
      }
    }
  }
});
