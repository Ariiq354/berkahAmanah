<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Persetujuan / Pemindahbukuan");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch(
    "/api/pemindahbukuan/persetujuan"
  );
  const { data: saham } = await useFetch("/api/saham/now");
  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.pemindahbukuanId);
  });

  watch(selectedItem, () => {
    state.value.setoranId = selectedItem.value!.idSetoran;
    state.value.penarikanId = selectedItem.value!.idPenarikan;
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/pemindahbukuan/persetujuan",
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
    state.value.pemindahbukuanId = id;
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Persetujuan | Pemindahbukuan</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Pemindahbukuan">
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          id="persetujuan-pemindahbukuan"
        >
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Kode Transaksi">
              <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
            </UFormField>
            <UFormField label="Jenis Transaksi">
              <UInput :model-value="selectedItem?.jenis" disabled />
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
          <div
            v-if="selectedItem?.jenis === 'Saham'"
            class="grid grid-cols-3 gap-2"
          >
            <UFormField label="Jumlah Saham">
              <UInput :model-value="selectedItem?.jumlahSaham" disabled />
            </UFormField>
            <UFormField label="Harga Dasar">
              <UInput
                :model-value="
                  (50000 * selectedItem!.jumlahSaham!).toLocaleString('id-ID')
                "
                disabled
              />
            </UFormField>
            <UFormField label="Harga Saham">
              <UInput
                :model-value="
                  (saham!.nilai * selectedItem!.jumlahSaham!).toLocaleString(
                    'id-ID'
                  )
                "
                disabled
              />
            </UFormField>
          </div>
          <UFormField label="Nilai Pemindahbukuan">
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
          form="persetujuan-pemindahbukuan"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Kelola Pemindahbukuan"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
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
