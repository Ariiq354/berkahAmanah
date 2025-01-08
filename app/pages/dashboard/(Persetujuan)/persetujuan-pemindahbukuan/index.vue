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
  const { data, status, refresh } = await useLazyFetch(
    "/api/pemindahbukuan/persetujuan"
  );
  const { data: saham } = await useLazyFetch("/api/saham/now");
  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.pemindahbukuanId);
  });

  watch(selectedItem, () => {
    state.value.setoranId = selectedItem.value?.idSetoran;
    state.value.penarikanId = selectedItem.value?.idPenarikan;
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
  <main>
    <Title>Persetujuan | Pemindahbukuan</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Pemindahbukuan"
      :pending="isLoading"
      :ui="{ width: 'OlaSeni:max-w-4xl' }"
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
          <UFormGroup label="Jenis Transaksi">
            <UInput :model-value="selectedItem?.jenis" disabled />
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
        <div
          v-if="selectedItem?.jenis === 'Saham'"
          class="grid grid-cols-3 gap-2"
        >
          <UFormGroup label="Jumlah Saham">
            <UInput :model-value="selectedItem?.jumlahSaham" disabled />
          </UFormGroup>
          <UFormGroup label="Harga Dasar">
            <UInput
              :model-value="
                (50000 * selectedItem!.jumlahSaham!).toLocaleString('id-ID')
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Harga Saham">
            <UInput
              :model-value="
                (saham!.nilai * selectedItem!.jumlahSaham!).toLocaleString(
                  'id-ID'
                )
              "
              disabled
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Nilai Pemindahbukuan">
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
        label="Kelola Pemindahbukuan"
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
