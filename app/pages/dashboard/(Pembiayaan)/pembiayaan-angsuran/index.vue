<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    angsuranColumns,
    getInitialFormData,
    murabahahColumns,
    createSchema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Pembiayaan / Angsuran");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/angsuran");
  const selectedItem = computed(() => {
    return data.value?.murabahah.find(
      (item) => item.id === state.value.pembiayaanId
    );
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/angsuran",
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
    state.value.pembiayaanId = id;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Pembiayaan | Angsuran</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Angsuran"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="createSchema(selectedItem!.sisa)"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-3 gap-4">
          <UFormGroup label="Kode Transaksi">
            <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
          </UFormGroup>
          <UFormGroup label="Total">
            <UInput
              :model-value="
                (selectedItem!.pokok + selectedItem!.margin).toLocaleString(
                  'id-ID'
                )
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Tempo">
            <UInput :model-value="selectedItem?.tempo" disabled />
          </UFormGroup>
        </div>
        <UFormGroup label="Tujuan">
          <UInput :model-value="selectedItem?.tujuan" disabled />
        </UFormGroup>
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Sisa">
            <UInput
              :model-value="selectedItem?.sisa.toLocaleString('id-ID')"
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Persentase">
            <UInput
              :model-value="selectedItem!.pokok / selectedItem!.margin"
              disabled
            />
          </UFormGroup>
        </div>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Jumlah Angsuran" name="jumlah">
            <UInput
              v-model="state.jumlah"
              type="number"
              :max="selectedItem?.sisa"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Pokok">
            <UInput
              :model-value="
                state.jumlah
                  ? (state.jumlah * selectedItem!.pokok) /
                    (selectedItem!.pokok + selectedItem!.margin)
                  : 0
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Nilai Margin">
            <UInput
              :model-value="
                state.jumlah
                  ? (state.jumlah * selectedItem!.margin) /
                    (selectedItem!.pokok + selectedItem!.margin)
                  : 0
              "
              disabled
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Keterangan" name="keterangan">
          <UInput v-model="state.keterangan" :disabled="isLoading" />
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
        label="Daftar Murabahah"
        :columns="murabahahColumns"
        :data="data?.murabahah"
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
        <template #total-data="{ row }">
          {{ (row.pokok + row.margin).toLocaleString("id-ID") }}
        </template>
        <template #angsuran-data="{ row }">
          {{ ((row.pokok + row.margin) / row.tempo).toLocaleString("id-ID") }}
        </template>
        <template #sisa-data="{ row }">
          {{ row.sisa.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id)">Pilih</UButton>
        </template>
      </AppTable>
      <AppTable
        label="Kelola Angsuran"
        :columns="angsuranColumns"
        :data="data?.angsuran"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="
              row.status === 0
                ? 'Belom Disetujui'
                : row.status === 1
                  ? 'Disetujui'
                  : 'Ditolak'
            "
            :color="
              row.status === 0 ? 'blue' : row.status === 1 ? 'green' : 'red'
            "
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #jumlah-data="{ row }">
          {{ row.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-data="{ row }">
          {{ row.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-data="{ row }">
          {{ row.margin.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
