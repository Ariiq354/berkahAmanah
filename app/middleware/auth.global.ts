import type { UserLucia } from "~~/server/database/schema/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const userI = useUserImpersonation();
  const requestFetch = useRequestFetch();

  const { data: res } = await useAsyncData(() =>
    requestFetch<UserLucia | false>("/api/auth/session")
  );
  const data = res.value;
  if (data) {
    user.value = data;
    if (!userI.value) {
      userI.value = data;
    }
  }
  const currentRoute = to.fullPath;

  // Basic Protection
  if (!data && currentRoute.includes("/dashboard")) {
    return navigateTo("/");
  }
  if (data && (currentRoute === "/" || currentRoute === "/register")) {
    return navigateTo("/dashboard");
  }

  // Custom Protection
  if (data) {
    const routePermissions: string[] = [
      "/dashboard/athar",
      "/dashboard/saham",
      "/dashboard/keuangan",
      "/dashboard/monitoring",
      "/dashboard/persetujuan",
      "/dashboard/transaksi",
    ];

    const isRestricted = routePermissions.some(
      (route) => currentRoute.includes(route) && data.role !== "admin"
    );

    if (isRestricted) {
      return navigateTo("/dashboard");
    }
  }
});
