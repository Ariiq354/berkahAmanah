<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    akunOptions,
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Transaksi / Daftar Transaksi");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/transaksi/input");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/transaksi/input",
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

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Transaksi | Daftar Transaksi</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Tambah Transaksi">
      <template #body>
        <UForm
          id="transaksi-input"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Nama Akun" name="kodeAkun">
            <USelectMenu
              v-model="state.kodeAkun"
              :items="akunOptions"
              label-key="name"
              value-key="value"
              :disabled="isLoading"
            />
          </UFormField>
          <UFormField label="Nilai" name="nilai">
            <UInput v-model="state.nilai" type="number" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Keterangan" name="keterangan">
            <UInput v-model="state.keterangan" :disabled="isLoading" />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
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
          form="transaksi-input"
        >
          Simpan
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <CrudCard :data="data" :add-function="clickAdd" :delete-button="false" />
      <AppTable
        label="Kelola Proker"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #nilai-cell="{ row }">
          {{ row.original.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
