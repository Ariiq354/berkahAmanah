<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Pembayaran Hutang");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch(
    "/api/pembelian-athar/pembayaran"
  );
  const selectedItem = computed(() => {
    return data.value?.find((i) => i.id === state.value.idPembelian);
  });

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/pembelian-athar/pembayaran",
      body: {
        ...event.data,
        nilai: selectedItem.value?.nilai,
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

  function clickAdd(id: number) {
    state.value.idPembelian = id;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Athar | Pembayaran Hutang</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Tambah Pembayaran Hutang"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-2xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormGroup label="Jumlah Galon">
            <UInput :model-value="selectedItem?.jumlahGalon" disabled />
          </UFormGroup>
          <UFormGroup label="Nilai">
            <UInput
              :model-value="selectedItem?.nilai.toLocaleString('id-ID')"
              disabled
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Tanggal" name="tanggal">
          <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
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
            Bayar
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Kelola Pembelian"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #select-data="{ row }">
          <UButton @click="clickAdd(row.id)">Pilih</UButton>
        </template>
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
