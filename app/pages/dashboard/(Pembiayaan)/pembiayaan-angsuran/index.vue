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
  const { data, status, refresh } = await useFetch("/api/angsuran");
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
  <Title>Pembiayaan | Angsuran</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Angsuran">
      <template #body>
        <UForm
          id="angsuran-form"
          :schema="createSchema(selectedItem!.sisa)"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-3 gap-4">
            <UFormField label="Kode Transaksi">
              <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
            </UFormField>
            <UFormField label="Total">
              <UInput
                :model-value="
                  (selectedItem!.pokok + selectedItem!.margin).toLocaleString(
                    'id-ID'
                  )
                "
                disabled
              />
            </UFormField>
            <UFormField label="Tempo">
              <UInput :model-value="selectedItem?.tempo" disabled />
            </UFormField>
          </div>
          <UFormField label="Tujuan">
            <UInput :model-value="selectedItem?.tujuan" disabled />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Sisa">
              <UInput
                :model-value="selectedItem?.sisa.toLocaleString('id-ID')"
                disabled
              />
            </UFormField>
            <UFormField label="Persentase">
              <UInput
                :model-value="selectedItem!.pokok / selectedItem!.margin"
                disabled
              />
            </UFormField>
          </div>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Jumlah Angsuran" name="jumlah">
              <UInput
                v-model="state.jumlah"
                type="number"
                :max="selectedItem?.sisa"
                :disabled="isLoading"
              />
            </UFormField>
            <UFormField label="Tanggal" name="tanggal">
              <UInput
                v-model="state.tanggal"
                type="date"
                :disabled="isLoading"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Nilai Pokok">
              <UInput
                :model-value="
                  state.jumlah
                    ? (state.jumlah * selectedItem!.pokok) /
                      (selectedItem!.pokok + selectedItem!.margin)
                    : 0
                "
                disabled
              />
            </UFormField>
            <UFormField label="Nilai Margin">
              <UInput
                :model-value="
                  state.jumlah
                    ? (state.jumlah * selectedItem!.margin) /
                      (selectedItem!.pokok + selectedItem!.margin)
                    : 0
                "
                disabled
              />
            </UFormField>
          </div>
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
          form="angsuran-form"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Daftar Murabahah"
        :columns="murabahahColumns"
        :data="data?.murabahah"
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
        <template #total-cell="{ row }">
          {{
            (row.original.pokok + row.original.margin).toLocaleString("id-ID")
          }}
        </template>
        <template #angsuran-cell="{ row }">
          {{
            (
              (row.original.pokok + row.original.margin) /
              row.original.tempo
            ).toLocaleString("id-ID")
          }}
        </template>
        <template #sisa-cell="{ row }">
          {{ row.original.sisa.toLocaleString("id-ID") }}
        </template>
        <template #select-cell="{ row }">
          <UButton @click="clickAdd(row.original.id)">Pilih</UButton>
        </template>
      </AppTable>
      <AppTable
        :columns="angsuranColumns"
        :data="data?.angsuran"
        :loading="status === 'pending'"
        :action="false"
        :select="false"
      >
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            :label="
              row.original.status === 0
                ? 'Belom Disetujui'
                : row.original.status === 1
                  ? 'Disetujui'
                  : 'Ditolak'
            "
            :color="
              row.original.status === 0
                ? 'info'
                : row.original.status === 1
                  ? 'success'
                  : 'error'
            "
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #jumlah-cell="{ row }">
          {{ row.original.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-cell="{ row }">
          {{ row.original.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-cell="{ row }">
          {{ row.original.margin.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
