<script lang="ts" setup>
  const props = defineProps<{
    function: () => Promise<void>;
  }>();

  const emit = defineEmits(["close"]);

  const loading = ref(false);
  async function onClick() {
    loading.value = true;
    try {
      await props.function();
      emit("close");
    } catch (error: any) {
      useToastError(String(error.statusCode), error.statusText);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
    title="Confirm"
  >
    <template #body>
      <div class="space-y-5">
        <div class="flex items-center gap-4">
          <UIcon name="i-heroicons-exclamation-triangle" size="36" />
          Are you sure you want to delete the selected products?
        </div>
        <div class="flex w-full justify-end gap-2">
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            variant="ghost"
            :disabled="loading"
            class="text-base"
            @click="emit('close')"
          >
            No
          </UButton>
          <UButton
            icon="i-heroicons-check-16-solid"
            variant="ghost"
            :loading="loading"
            class="text-base"
            @click="onClick"
          >
            Yes
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
