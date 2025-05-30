<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Transaksi / Daftar Transaksi");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/transaksi");
  const { data: akunOptions } = await useFetch("/api/akun");
  const { data: anggotaOptions } = await useFetch("/api/users");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/transaksi",
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

  const tableSelected = ref<ExtractObjectType<typeof data.value>[]>([]);
  async function clickDelete() {
    async function onDelete() {
      const idArray = tableSelected.value.map((item) => item.id);
      await $fetch("/api/transaksi", {
        method: "DELETE",
        body: {
          id: idArray,
        },
      });
      tableSelected.value = [];
      await refresh();
    }
    openConfirmModal(onDelete);
  }

  function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Transaksi | Daftar Transaksi</Title>
    <LazyUModal
      v-model:open="modalOpen"
      :title="state.id ? 'Edit' : 'Tambah' + ' Transaksi'"
    >
      <template #body>
        <UForm
          id="transaski-transaksi"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Kode Transaksi" name="kodeTransaksi">
            <UInput v-model="state.kodeTransaksi" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Nama Akun" name="kodeAkun">
            <USelectMenu
              v-model="state.kodeAkun"
              :items="akunOptions"
              label-key="namaAkun"
              value-key="id"
              :disabled="isLoading"
            />
          </UFormField>
          <UFormField label="Nama Anggota" name="anggotaId">
            <USelectMenu
              v-model="state.anggotaId"
              :items="anggotaOptions"
              label-key="namaLengkap"
              value-key="id"
              :disabled="isLoading"
            />
          </UFormField>
          <UFormField label="Nilai" name="nilai">
            <UInput v-model="state.nilai" type="number" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Tanggal" name="tanggal">
            <UInput v-model="state.tanggal" type="date" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Keterangan" name="keterangan">
            <UInput v-model="state.keterangan" :disabled="isLoading" />
          </UFormField>

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
          form="transaski-transaksi"
        >
          Simpan
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <CrudCard
        :data="data"
        :add-function="clickAdd"
        :delete-function="clickDelete"
        :delete-disabled="tableSelected ? tableSelected.length === 0 : true"
      />
      <AppTable
        v-model="tableSelected"
        label="Kelola Proker"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #nilai-cell="{ row }">
          {{ row.original.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
