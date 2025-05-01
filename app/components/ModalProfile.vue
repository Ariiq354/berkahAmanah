<script setup lang="ts">
  import * as v from "valibot";
  import type { FormSubmitEvent } from "#ui/types";

  const modalOpen = defineModel<boolean>();
  const user = useUser();
  const initialFormData = (): Schema => ({
    password: undefined,
  });
  const state = ref(initialFormData());

  const schema = v.object({
    password: v.optional(v.string()),
  });

  watch(modalOpen, () => {
    console.log(modalOpen.value);
    if (modalOpen.value) {
      state.value = initialFormData();
    }
  });

  type Schema = v.InferOutput<typeof schema>;

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
  <UModal v-model:open="modalOpen" title="Profil Anda">
    <template #body>
      <UForm
        id="modal-profile"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex gap-4">
          <div class="flex w-full flex-col gap-4">
            <UFormField label="Email">
              <UInput :model-value="user?.email" disabled />
            </UFormField>
            <UFormField label="No Telepon">
              <UInput :model-value="user?.noTelepon" disabled />
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput
                v-model="state.password"
                :disabled="modalLoading"
                type="password"
              />
            </UFormField>
          </div>
        </div>
      </UForm>
    </template>
    <template #footer>
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
        form="modal-profile"
        icon="i-heroicons-check-16-solid"
        :loading="modalLoading"
      >
        Simpan
      </UButton>
    </template>
  </UModal>
</template>
