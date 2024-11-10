<script lang="ts" setup>
  const props = defineProps<{
    function: () => Promise<void>;
  }>();

  const emit = defineEmits(["success"]);

  const modal = useModal();
  const loading = ref(false);
  async function onClick() {
    loading.value = true;
    try {
      await props.function();
      emit("success");
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.message);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <UModal prevent-close :ui="{ width: 'sm:max-w-lg' }">
    <div class="space-y-5 p-5">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-black dark:text-white">
          Konfimasi
        </h1>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1 rounded-full"
          @click="modal.close()"
        />
      </div>
      <div class="flex items-center gap-4">
        <UIcon name="i-heroicons-exclamation-triangle" size="36" />
        Apakah Anda yakin ingin menghapus item yang dipilih?
      </div>
      <div class="flex w-full justify-end gap-2">
        <UButton
          icon="i-heroicons-x-mark-16-solid"
          variant="ghost"
          :disabled="loading"
          class="text-base"
          @click="modal.close()"
        >
          Tidak
        </UButton>
        <UButton
          icon="i-heroicons-check-16-solid"
          variant="ghost"
          :loading="loading"
          class="text-base"
          @click="onClick"
        >
          Iya
        </UButton>
      </div>
    </div>
  </UModal>
</template>
