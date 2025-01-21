<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    HARGA_ATHAR,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Pembelian");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/pembelian-athar");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/pembelian-athar",
      body: {
        ...event.data,
        nilai: event.data.jumlahGalon * HARGA_ATHAR,
      },
      onSuccess() {
        modalOpen.value = false;
        refresh();
      },
      onError(error) {
        useToastError(String(error.statusCode), error.data.message);
      },
    });
  }

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Athar | Pembelian</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Tambah Pembelian"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-2xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormGroup label="Jumlah Galon" name="jumlahGalon">
            <UInput
              v-model="state.jumlahGalon"
              type="number"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Harga / Galon">
            <UInput
              :model-value="HARGA_ATHAR.toLocaleString('id-ID')"
              disabled
            />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormGroup label="Nilai">
            <UInput
              :model-value="
                (HARGA_ATHAR * state.jumlahGalon!).toLocaleString('id-ID')
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormGroup>
        </div>

        <div class="flex w-full justify-end gap-2">
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            variant="ghost"
            :disabled="isLoading"
            @click="modalOpen = false"
          >
            Batal
          </UButton>
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            :loading="isLoading"
          >
            Simpan
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <CrudCard :data="data" :add-function="clickAdd" :delete-button="false" />
      <AppTable
        label="Kelola Pembelian"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="row.status ? 'Sudah Dibayar' : 'Belum Dibayar'"
            :color="row.status ? 'green' : 'red'"
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
