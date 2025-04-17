<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Transaksi / Daftar Akun");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/akun");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/akun",
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
      await $fetch("/api/akun", {
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
  <Title>Transaksi | Daftar Akun</Title>
  <main>
    <LazyUModal
      v-model:open="modalOpen"
      :title="state.id ? 'Edit' : 'Tambah' + ' Akun'"
    >
      <template #body>
        <UForm
          id="transaksi-a"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Kode Akun" name="kodeAkun">
            <UInput v-model="state.kodeAkun" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Nama Akun" name="namaAkun">
            <UInput v-model="state.namaAkun" :disabled="isLoading" />
          </UFormField>
          <UFormField label="Status" name="status">
            <UToggle v-model="state.status" :disabled="isLoading" />
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
          form="transaksi-akun"
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
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            :label="row.original.status ? 'Aktif' : 'Tidak Aktif'"
            :color="row.original.status ? 'success' : 'error'"
            variant="solid"
            class="rounded-full"
          />
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
