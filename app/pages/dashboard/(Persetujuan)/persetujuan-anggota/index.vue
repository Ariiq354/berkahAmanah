<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Persetujuan / Anggota");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/users/inactive");
  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.id);
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/users/status",
      body: event.data,
      onSuccess() {
        modalOpen.value = false;
        refresh();
      },
      onError(error) {
        useToastError(String(error.statusCode), error.data.message);
      },
    });
  }

  function clickAdd(id: number) {
    state.value.id = id;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Persetujuan | Anggota</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Anggota"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Nama Lengkap">
          <UInput :model-value="selectedItem?.namaLengkap" disabled />
        </UFormGroup>
        <UFormGroup label="No Telepon">
          <UInput :model-value="selectedItem?.noTelepon" disabled />
        </UFormGroup>
        <UFormGroup label="Email">
          <UInput :model-value="selectedItem?.email" disabled />
        </UFormGroup>

        <div class="flex w-full justify-end gap-2">
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            color="red"
            type="submit"
            :disabled="isLoading"
            @click="state.status = false"
          >
            Tolak
          </UButton>
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            :loading="isLoading"
            @click="state.status = true"
          >
            Setuju
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Kelola Setoran"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
