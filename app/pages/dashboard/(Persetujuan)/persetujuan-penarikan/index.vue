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
  const { data, status, refresh } = await useFetch(
    "/api/penarikan/persetujuan"
  );
  const { data: saldo } = await useFetch(
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
  <Title>Persetujuan | Penarikan</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Penarikan">
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          id="persetujuan-penarikan"
        >
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Kode Transaksi">
              <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
            </UFormField>
          </div>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="No Anggota">
              <UInput :model-value="selectedItem?.noUser" disabled />
            </UFormField>
            <UFormField label="Nama Anggota">
              <UInput :model-value="selectedItem?.namaLengkap" disabled />
            </UFormField>
          </div>
          <UFormField label="Saldo Simpanan">
            <UInput :model-value="saldo?.saldo" disabled />
          </UFormField>
          <UFormField label="Nilai Penarikan">
            <UInput :model-value="selectedItem?.nilai" disabled />
          </UFormField>
          <UFormField label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Keterangan">
            <UInput :model-value="selectedItem?.keterangan" disabled />
          </UFormField>
          <UFormField label="Alasan Penolakan" name="alasan">
            <UInput v-model="state.alasan" :disabled="isLoading" />
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
          form="persetujuan-penarikan"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Kelola Penarikan"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
        :select="false"
      >
        <template #nilai-cell="{ row }">
          {{ row.original.nilai.toLocaleString("id-ID") }}
        </template>
        <template #select-cell="{ row }">
          <UButton @click="clickAdd(row.original.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
