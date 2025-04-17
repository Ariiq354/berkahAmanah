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
  const { data, status, refresh } = await useFetch("/api/users/inactive");
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
  <Title>Persetujuan | Anggota</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Anggota">
      <template #body>
        <UForm
          id="persetujuan-anggota"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Nama Lengkap">
            <UInput :model-value="selectedItem?.namaLengkap" disabled />
          </UFormField>
          <UFormField label="No Telepon">
            <UInput :model-value="selectedItem?.noTelepon" disabled />
          </UFormField>
          <UFormField label="Email">
            <UInput :model-value="selectedItem?.email" disabled />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton
          icon="i-heroicons-x-mark-16-solid"
          color="error"
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
          form="persetujuan-anggota"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Kelola Setoran"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #select-cell="{ row }">
          <UButton @click="clickAdd(row.original.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
