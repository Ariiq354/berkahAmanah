<script setup lang="ts">
  const user = useUser();

  const sidebarState = useSidebarToggle();

  async function logout() {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
      });
      user.value = null;
      await navigateTo("/");
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.statusMessage);
    }
  }
</script>

<template>
  <section class="flex">
    <AppSidebar />
    <div
      class="flex flex-1 flex-col overflow-auto p-4 transition-all duration-200 md:p-8"
      :class="{ 'md:ml-72': sidebarState }"
    >
      <AppTopbar :logout="logout" />
      <slot />
    </div>
  </section>
</template>
