<script setup lang="ts">
  const user = useUser();
  if (user.value) {
    await navigateTo("/dashboard");
  }
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <slot />
  </div>
</template>
