<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Persetujuan / Angsuran");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/angsuran/persetujuan");
  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.angsuranId);
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/angsuran/persetujuan",
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
    state.value.angsuranId = id;
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Persetujuan | Angsuran</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Angsuran">
      <template #body>
        <UForm
          id="persetujuan-angsuran"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Kode Transaksi">
              <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
            </UFormField>
            <UFormField label="No Pembiayaan">
              <UInput :model-value="selectedItem?.noPembiayaan" disabled />
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
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Nilai Pokok">
              <UInput :model-value="selectedItem?.pokok" disabled />
            </UFormField>
            <UFormField label="Nilai Margin">
              <UInput :model-value="selectedItem?.margin" disabled />
            </UFormField>
          </div>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Nilai Angsuran">
              <UInput :model-value="selectedItem?.jumlah" disabled />
            </UFormField>
            <UFormField label="Tanggal" name="tanggal">
              <UInput
                v-model="state.tanggal"
                type="date"
                :disabled="isLoading"
              />
            </UFormField>
          </div>
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
          color="error"
          type="submit"
          :disabled="isLoading"
          @click="state.setuju = false"
        >
          Tolak
        </UButton>
        <UButton
          type="submit"
          icon="i-heroicons-check-16-solid"
          :loading="isLoading"
          @click="state.setuju = true"
          form="persetujuan-angsuran"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Kelola Angsuran"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #jumlah-cell="{ row }">
          {{ row.original.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-cell="{ row }">
          {{ row.original.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-cell="{ row }">
          {{ row.original.margin.toLocaleString("id-ID") }}
        </template>
        <template #select-cell="{ row }">
          <UButton @click="clickAdd(row.original.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
