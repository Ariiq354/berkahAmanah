<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Persetujuan / Penarikan");
  });

  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.penarikanId);
  });
  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch(
    "/api/penarikan/persetujuan"
  );
  const { data: saldo } = await useLazyFetch(
    () => `/api/setoran/saldo?anggotaId=${selectedItem.value?.anggotaId}`
  );

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/penarikan/persetujuan",
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
    state.value.penarikanId = id;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Persetujuan | Penarikan</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Penarikan"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Kode Transaksi">
            <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
          </UFormGroup>
        </div>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="No Anggota">
            <UInput :model-value="selectedItem?.noUser" disabled />
          </UFormGroup>
          <UFormGroup label="Nama Anggota">
            <UInput :model-value="selectedItem?.namaLengkap" disabled />
          </UFormGroup>
        </div>
        <UFormGroup label="Saldo Simpanan">
          <UInput :model-value="saldo?.saldo" disabled />
        </UFormGroup>
        <UFormGroup label="Nilai Penarikan">
          <UInput :model-value="selectedItem?.nilai" disabled />
        </UFormGroup>
        <UFormGroup label="Tanggal" name="tanggal">
          <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
        </UFormGroup>
        <UFormGroup label="Keterangan">
          <UInput :model-value="selectedItem?.keterangan" disabled />
        </UFormGroup>
        <UFormGroup label="Alasan Penolakan" name="alasan">
          <UInput v-model="state.alasan" :disabled="isLoading" />
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
            Setuju
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Kelola Penarikan"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
