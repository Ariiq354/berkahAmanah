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
  const { data, status, refresh } = await useFetch("/api/penjualan-athar");

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
  <Title>Athar | Penjualan</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Tambah Penjualan">
      <template #body>
        <UForm
          id="athar-penjualan"
          :schema="schema(limitGalon)"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField label="Jumlah Galon" name="jumlahGalon">
              <UInput
                v-model="state.jumlahGalon"
                type="number"
                :disabled="isLoading"
              />
            </UFormField>
            <UFormField label="Harga / Galon">
              <UInput
                :model-value="selectedPrice.toLocaleString('id-ID')"
                disabled
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField label="Nilai" name="nilai">
              <UInput
                v-model="state.nilai"
                type="number"
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
          form="athar-penjualan"
        >
          Simpan
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Daftar Galon"
        :columns="galonColumns"
        :data="data?.remainingGalon"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #price-cell="{ row }">
          {{ row.original.price.toLocaleString("id-ID") }}
        </template>
        <template #select-cell="{ row }">
          <UButton
            @click="clickAdd(row.original.price, row.original.jumlahGalon)"
            >Pilih</UButton
          >
        </template>
      </AppTable>
      <AppTable
        label="Daftar Penjualan"
        :columns="columns"
        :data="data?.data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            :label="row.original.status ? 'Sudah Dibayar' : 'Belum Dibayar'"
            :color="row.original.status ? 'success' : 'error'"
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #nilai-cell="{ row }">
          {{ row.original.nilai.toLocaleString("id-ID") }}
        </template>
        <template #margin-cell="{ row }">
          {{ row.original.margin.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
