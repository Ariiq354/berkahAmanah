<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    jaminanOptions,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Persetujuan / Murabahah");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch(
    "/api/murabahah/persetujuan"
  );
  const selectedItem = computed(() => {
    return data.value?.find((item) => item.id === state.value.pembiayaanId);
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/murabahah/persetujuan",
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

  function clickAdd(id: number, nilai: number) {
    state.value.pembiayaanId = id;
    state.value.nilai = nilai;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Persetujuan | Murabahah</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Murabahah"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Kode Transaksi">
          <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
        </UFormGroup>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="No Anggota">
            <UInput :model-value="selectedItem?.noUser" disabled />
          </UFormGroup>
          <UFormGroup label="Nama Anggota">
            <UInput :model-value="selectedItem?.namaLengkap" disabled />
          </UFormGroup>
        </div>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Pengajuan">
            <UInput :model-value="selectedItem?.jumlah" disabled />
          </UFormGroup>
          <UFormGroup label="Tempo">
            <UInput :model-value="selectedItem?.tempo" disabled />
          </UFormGroup>
        </div>
        <UFormGroup label="Tujuan Pengajuan">
          <UInput :model-value="selectedItem?.tujuan" disabled />
        </UFormGroup>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Pokok" name="nilai">
            <UInput v-model="state.nilai" type="number" :disabled="isLoading" />
          </UFormGroup>
          <UFormGroup label="Margin" name="margin">
            <UInput
              v-model="state.margin"
              type="number"
              :disabled="isLoading"
            />
          </UFormGroup>
        </div>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Nilai Pembiayaan Disetujui">
            <UInput
              :model-value="
                state.margin && state.nilai
                  ? (state.nilai + state.margin).toLocaleString('id-ID')
                  : 0
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Persentase">
            <UInput
              :model-value="
                state.margin && state.nilai
                  ? ((state.margin / state.nilai) * 100).toFixed(2)
                  : 0
              "
              disabled
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Tanggal Akad" name="tanggal">
          <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
        </UFormGroup>
        <UFormGroup label="Jaminan" name="jaminan">
          <USelectMenu
            v-model="state.jaminan"
            :options="jaminanOptions"
            :disabled="isLoading"
          />
        </UFormGroup>
        <UFormGroup label="Tempo Disetujui" name="tempo">
          <UInput v-model="state.tempo" type="number" :disabled="isLoading" />
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
        label="Kelola Murabahah"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id, row.jumlah)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
