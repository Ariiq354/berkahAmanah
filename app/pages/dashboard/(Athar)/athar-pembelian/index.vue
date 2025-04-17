<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Pembelian");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/pembelian-athar");
  const { data: HARGA_ATHAR } = await useFetch("/api/athar/now");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/pembelian-athar",
      body: {
        ...event.data,
        nilai: event.data.jumlahGalon * HARGA_ATHAR.value!.nilai,
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

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Athar | Pembelian</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Tambah Pembelian">
      <template #body>
        <UForm
          id="athar-pembelian"
          :schema="schema"
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
                :model-value="HARGA_ATHAR!.nilai.toLocaleString('id-ID')"
                disabled
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField label="Nilai">
              <UInput
                :model-value="
                  (HARGA_ATHAR!.nilai * state.jumlahGalon!).toLocaleString(
                    'id-ID'
                  )
                "
                disabled
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

          <div class="flex w-full justify-end gap-2"></div>
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
          form="athar-pembelian"
        >
          Simpan
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <CrudCard :data="data" :add-function="clickAdd" :delete-button="false" />
      <AppTable
        label="Kelola Pembelian"
        :columns="columns"
        :data="data"
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
      </AppTable>
    </UCard>
  </main>
</template>
