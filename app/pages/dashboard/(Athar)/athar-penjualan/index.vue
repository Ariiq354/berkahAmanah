<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    galonColumns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Penjualan");
  });

  const state = ref(getInitialFormData());
  const selectedPrice = ref(0);
  const limitGalon = ref();
  const { data, status, refresh } = await useLazyFetch("/api/penjualan-athar");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/penjualan-athar",
      body: {
        ...event.data,
        margin: event.data.nilai - selectedPrice.value * event.data.jumlahGalon,
      },
      onSuccess() {
        modalOpen.value = false;
        refresh();
      },
      onError(error) {
        useToastError(String(error.statusCode), error.data.message);
      },
    });
  }

  function clickAdd(price: number, jumlahGalon: number) {
    selectedPrice.value = price;
    limitGalon.value = jumlahGalon;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Athar | Penjualan</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Tambah Penjualan"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-2xl' }"
    >
      <UForm
        :schema="schema(limitGalon)"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormGroup label="Jumlah Galon" name="jumlahGalon">
            <UInput
              v-model="state.jumlahGalon"
              type="number"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Harga / Galon">
            <UInput
              :model-value="selectedPrice.toLocaleString('id-ID')"
              disabled
            />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormGroup label="Nilai" name="nilai">
            <UInput v-model="state.nilai" type="number" :disabled="isLoading" />
          </UFormGroup>
          <UFormGroup label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormGroup>
        </div>

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
            Simpan
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Daftar Galon"
        :columns="galonColumns"
        :data="data?.remainingGalon"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #price-data="{ row }">
          {{ row.price.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.price, row.jumlahGalon)">Pilih</UButton>
        </template>
      </AppTable>
      <AppTable
        label="Daftar Penjualan"
        :columns="columns"
        :data="data?.data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="row.status ? 'Sudah Dibayar' : 'Belum Dibayar'"
            :color="row.status ? 'green' : 'red'"
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
        <template #margin-data="{ row }">
          {{ row.margin.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
