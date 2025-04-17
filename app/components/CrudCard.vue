<script setup lang="ts">
  type DataItem = { [key: string]: any };

  const { addButton = true, deleteButton = true } = defineProps<{
    data: DataItem[] | undefined;
    addButton?: boolean;
    isLoading?: boolean;
    deleteButton?: boolean;
    deleteDisabled?: boolean;
    addFunction?: () => void;
    deleteFunction?: () => void;
  }>();
</script>

<template>
  <div
    class="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-(--ui-border-accented) p-3"
  >
    <div v-if="addButton || deleteButton" class="flex flex-wrap gap-2">
      <UButton
        v-if="addButton"
        icon="i-heroicons-plus"
        :disabled="isLoading"
        variant="soft"
        class="gap-2 text-xs text-black md:text-base dark:text-white"
        @click="addFunction"
      >
        Tambah
      </UButton>
      <UButton
        v-if="deleteButton"
        icon="i-heroicons-trash"
        variant="soft"
        class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
        :disabled="deleteDisabled || isLoading"
        @click="deleteFunction"
      >
        Hapus
      </UButton>
    </div>
    <div class="flex gap-2">
      <slot />
      <UButton
        icon="i-heroicons-arrow-up-tray"
        variant="soft"
        class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
        :disabled="!(data && data.length > 0) || isLoading"
        @click="json2Csv(data!)"
      >
        Ekspor
      </UButton>
    </div>
  </div>
</template>
