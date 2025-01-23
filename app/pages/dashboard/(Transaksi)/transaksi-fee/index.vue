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
  const { data, status, refresh } = await useLazyFetch("/api/fee-management");
  const { data: anggota } = await useLazyFetch("/api/users/admin");
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
  <main>
    <Title>Transaksi | Input Fee Management</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Tambah Fee Management"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormGroup label="Nama Anggota" name="anggotaId">
            <USelectMenu
              v-model="state.anggotaId"
              :options="anggota"
              option-attribute="namaLengkap"
              value-attribute="id"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Nama Anggota">
            <USelectMenu :model-value="selectedAnggota?.noUser" disabled />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormGroup label="Nilai" name="nilai">
            <USelectMenu
              v-model="state.nilai"
              type="number"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Tanggal" name="tanggal">
            <USelectMenu
              v-model="state.tanggal"
              type="date"
              :disabled="isLoading"
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Keterangan" name="keterangan">
          <USelectMenu v-model="state.keterangan" :disabled="isLoading" />
        </UFormGroup>

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
        label="Kelola Proker"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
