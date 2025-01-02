<script setup lang="ts">
  import { z } from "zod";
  import type { FormSubmitEvent } from "#ui/types";

  const modalOpen = defineModel<boolean>();
  const user = useUser();
  const initialFormData = (): Partial<Schema> => ({
    password: undefined,
  });
  const state = ref(initialFormData());

  const schema = z.object({
    password: z.string().optional(),
  });

  watch(modalOpen, () => {
    if (modalOpen.value) {
      state.value = initialFormData();
    }
  });

  type Schema = z.output<typeof schema>;

  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;
      await $fetch("/api/users/edit", {
        method: "POST",
        body: event.data,
      });
      modalOpen.value = false;
      useToastSuccess("Update Berhasil", "Password anda telah diganti");
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.message);
    } finally {
      modalLoading.value = false;
    }
  }
</script>

<template>
  <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-2xl' }" prevent-close>
    <div class="px-4 py-5">
      <div class="mb-4 flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          Profil Anda
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1 rounded-full"
          @click="modalOpen = false"
        />
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex gap-4">
          <div class="flex w-full flex-col gap-4">
            <UFormGroup label="Email" class="w-full">
              <UInput :model-value="user?.email" disabled />
            </UFormGroup>
            <UFormGroup label="No Telepon" class="w-full">
              <UInput :model-value="user?.noTelepon" disabled />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="w-full">
              <UInput
                v-model="state.password"
                :disabled="modalLoading"
                type="password"
              />
            </UFormGroup>
          </div>
        </div>
        <div class="flex w-full justify-end gap-2">
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            variant="ghost"
            :disabled="modalLoading"
            @click="modalOpen = false"
          >
            Batal
          </UButton>
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            :loading="modalLoading"
          >
            Simpan
          </UButton>
        </div>
      </UForm>
    </div>
  </UModal>
</template>
