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
  const { data, status, refresh } = await useFetch(
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
  <Title>Persetujuan | Murabahah</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Murabahah">
      <template #body>
        <UForm
          id="persetujuan-murabahah"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Kode Transaksi">
            <UInput :model-value="selectedItem?.kodeTransaksi" disabled />
          </UFormField>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="No Anggota">
              <UInput :model-value="selectedItem?.noUser" disabled />
            </UFormField>
            <UFormField label="Nama Anggota">
              <UInput :model-value="selectedItem?.namaLengkap" disabled />
            </UFormField>
          </div>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Nilai Pengajuan">
              <UInput :model-value="selectedItem?.jumlah" disabled />
            </UFormField>
            <UFormField label="Tempo">
              <UInput :model-value="selectedItem?.tempo" disabled />
            </UFormField>
          </div>
          <UFormField label="Tujuan Pengajuan">
            <UInput :model-value="selectedItem?.tujuan" disabled />
          </UFormField>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Nilai Pokok" name="nilai">
              <UInput
                v-model="state.nilai"
                type="number"
                :disabled="isLoading"
              />
            </UFormField>
            <UFormField label="Margin" name="margin">
              <UInput
                v-model="state.margin"
                type="number"
                :disabled="isLoading"
              />
            </UFormField>
          </div>
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Nilai Pembiayaan Disetujui">
              <UInput
                :model-value="
                  state.margin && state.nilai
                    ? (state.nilai + state.margin).toLocaleString('id-ID')
                    : 0
                "
                disabled
              />
            </UFormField>
            <UFormField label="Persentase">
              <UInput
                :model-value="
                  state.margin && state.nilai
                    ? ((state.margin / state.nilai) * 100).toFixed(2)
                    : 0
                "
                disabled
              />
            </UFormField>
          </div>
          <UFormField label="Tanggal Akad" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Jaminan" name="jaminan">
            <USelectMenu
              v-model="state.jaminan"
              :items="jaminanOptions"
              :disabled="isLoading"
            />
          </UFormField>
          <UFormField label="Tempo Disetujui" name="tempo">
            <UInput v-model="state.tempo" type="number" :disabled="isLoading" />
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
          form="persetujuan-murabahah"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Kelola Murabahah"
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
          <UButton @click="clickAdd(row.original.id, row.original.jumlah)"
            >Pilih</UButton
          >
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
