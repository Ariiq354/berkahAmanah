<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Transaksi / Input Fee Management");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/fee-management");
  const { data: anggota } = await useFetch("/api/users/admin");
  const selectedAnggota = computed(() => {
    return anggota.value?.find((i) => i.id === state.value.anggotaId);
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/fee-management",
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
  <Title>Transaksi | Input Fee Management</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Tambah Fee Management">
      <template #body>
        <UForm
          id="transaksi-fee"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Nama Anggota" name="anggotaId">
              <USelectMenu
                v-model="state.anggotaId"
                :items="anggota"
                label-key="namaLengkap"
                value-key="id"
                :disabled="isLoading"
              />
            </UFormField>
            <UFormField label="Nama Anggota">
              <USelectMenu :model-value="selectedAnggota?.noUser" disabled />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Nilai" name="nilai">
              <USelectMenu
                v-model="state.nilai"
                type="number"
                :disabled="isLoading"
              />
            </UFormField>
            <UFormField label="Tanggal" name="tanggal">
              <USelectMenu
                v-model="state.tanggal"
                type="date"
                :disabled="isLoading"
              />
            </UFormField>
          </div>
          <UFormField label="Keterangan" name="keterangan">
            <USelectMenu v-model="state.keterangan" :disabled="isLoading" />
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
          form="transaksi-fee"
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
