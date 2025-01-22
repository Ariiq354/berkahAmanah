<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    akunOptions,
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Transaksi / Daftar Transaksi");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/transaksi/input");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/transaksi/input",
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

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Transaksi | Daftar Transaksi</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Tambah Transaksi"
      :pending="isLoading"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Nama Akun" name="kodeAkun">
          <USelectMenu
            v-model="state.kodeAkun"
            :options="akunOptions"
            option-attribute="name"
            value-attribute="value"
            :disabled="isLoading"
          />
        </UFormGroup>
        <UFormGroup label="Nilai" name="nilai">
          <UInput v-model="state.nilai" type="number" :disabled="isLoading" />
        </UFormGroup>
        <UFormGroup label="Tanggal" name="tanggal">
          <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
        </UFormGroup>
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
            Simpan
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <CrudCard :data="data" :add-function="clickAdd" :delete-button="false" />
      <AppTable
        label="Kelola Proker"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
