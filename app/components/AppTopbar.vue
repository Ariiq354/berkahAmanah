<script setup lang="ts">
  const props = defineProps<{
    logout: () => Promise<void>;
  }>();

  const sidebarState = useSidebarToggle();

  const user = useUser();
  const topbarTitle = useTopbarTitle();

  const items = [
    [
      {
        label: "Keluar",
        icon: "i-heroicons-arrow-left-on-rectangle",
        click: () => {
          props.logout();
        },
      },
    ],
  ];

  const colorMode = useColorMode();

  function toggleColorMode() {
    if (colorMode.value === "dark") {
      colorMode.preference = "light";
    } else {
      colorMode.preference = "dark";
    }
  }
</script>

<template>
  <header class="mb-8 flex justify-between">
    <div class="flex items-center gap-8">
      <UButton
        class="hover:bg-primary rounded-full bg-transparent p-2 text-black transition-all duration-300 hover:text-white dark:bg-transparent dark:text-white"
        aria-label="Sidebar toggle"
        @click="sidebarState = !sidebarState"
      >
        <UIcon name="i-heroicons-bars-3" class="h-7 w-7" />
      </UButton>
      <h1 class="font-semibold text-gray-500 dark:text-gray-400">
        {{ topbarTitle }}
      </h1>
    </div>
    <div class="flex items-center gap-6">
      <UButton
        class="rounded-full p-2 text-black dark:text-white"
        variant="ghost"
        aria-label="Color mode toggle"
        @click="toggleColorMode"
      >
        <UIcon
          v-if="colorMode.value === 'dark'"
          name="i-heroicons-moon-solid"
          class="h-4 w-4"
        />
        <UIcon v-else name="i-heroicons-sun-solid" class="h-4 w-4" />
      </UButton>
      <UDropdown :items="items">
        <UAvatar class="bg-white" :alt="user ? user.username : 'Avatar'" />
      </UDropdown>
    </div>
  </header>
</template>
