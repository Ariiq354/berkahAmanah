import type { UserLucia } from "~~/server/database/schema/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const requestFetch = useRequestFetch();

  const { data } = await useAsyncData(
    () => requestFetch<UserLucia | false>("/api/v1/auth/session"),
    {
      dedupe: "defer",
    }
  );
  if (data.value) {
    user.value = data.value;
  }

  const currentRoute = to.fullPath;

  // Basic Protection
  if (!user.value && currentRoute.includes("/dashboard")) {
    return navigateTo("/");
  }
  if (user.value && (currentRoute === "/" || currentRoute === "/register")) {
    return navigateTo("/dashboard");
  }

  // Custom Protection
  if (user.value) {
    const routePermissions: string[] = [
      "/dashboard/athar",
      "/dashboard/saham",
      "/dashboard/keuangan",
      "/dashboard/monitoring",
      "/dashboard/persetujuan",
      "/dashboard/transaksi",
    ];

    const isRestricted = routePermissions.some(
      (route) => currentRoute.includes(route) && user.value?.role !== "admin"
    );

    if (isRestricted) {
      return navigateTo("/dashboard");
    }
  }
});
