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
  const { data, status, refresh } = await useLazyFetch(
    "/api/angsuran/persetujuan"
  );
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
  <main>
    <Title>Persetujuan | Angsuran</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Angsuran"
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
          <UFormGroup label="No Pembiayaan">
            <UInput :model-value="selectedItem?.noPembiayaan" disabled />
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
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Pokok">
            <UInput :model-value="selectedItem?.pokok" disabled />
          </UFormGroup>
          <UFormGroup label="Nilai Margin">
            <UInput :model-value="selectedItem?.margin" disabled />
          </UFormGroup>
        </div>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Angsuran">
            <UInput :model-value="selectedItem?.jumlah" disabled />
          </UFormGroup>
          <UFormGroup label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormGroup>
        </div>
        <UFormGroup label="Keterangan">
          <UInput :model-value="selectedItem?.keterangan" disabled />
        </UFormGroup>
        <UFormGroup label="Alasan Penolakan" name="alasan">
          <UInput v-model="state.alasan" :disabled="isLoading" />
        </UFormGroup>

        <div class="flex w-full justify-end gap-2">
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            color="red"
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
          >
            Setuju
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Kelola Angsuran"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #jumlah-data="{ row }">
          {{ row.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-data="{ row }">
          {{ row.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-data="{ row }">
          {{ row.margin.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
