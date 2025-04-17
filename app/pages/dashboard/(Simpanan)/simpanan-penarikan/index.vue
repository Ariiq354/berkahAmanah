<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    createSchema,
    getInitialFormData,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Simpanan / Penarikan");
  });

  const user = useUser();

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/penarikan");
  const { data: saldo, refresh: refreshSaldo } = await useFetch(
    () => `/api/setoran/saldo?anggotaId=${state.value.anggotaId}`,
    {
      immediate: false,
    }
  );
  const { data: anggota } = await useFetch("/api/users");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/penarikan",
      body: event.data,
      onSuccess() {
        modalOpen.value = false;
        refresh();
        refreshSaldo();
      },
      onError(error) {
        useToastError(String(error.statusCode), error.data.message);
      },
    });
  }

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
    if (user.value?.role !== "admin") {
      state.value.anggotaId = user.value!.id;
    }
  }

  function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <Title>Simpanan | Penarikan</Title>
  <main>
    <LazyUModal
      v-model:open="modalOpen"
      :title="(state.id ? 'Detail' : 'Tambah') + ' Penarikan'"
    >
      <template #body>
        <UForm
          id="penarikan-form"
          :schema="createSchema(saldo?.saldo)"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            v-if="user?.role === 'admin'"
            label="Nama Anggota"
            name="anggotaId"
          >
            <USelectMenu
              v-model="state.anggotaId"
              :items="anggota"
              label-key="namaLengkap"
              value-key="id"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
          <UFormField label="Saldo Simpanan">
            <UInput :model-value="saldo?.saldo" type="number" disabled />
          </UFormField>
          <UFormField label="Nilai Penarikan" name="nilai">
            <UInput
              v-model="state.nilai"
              type="number"
              min="0"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
          <UFormField label="Tanggal" name="tanggal">
            <UInput
              v-model="state.tanggal"
              type="date"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
          <UFormField label="Keterangan" name="keterangan">
            <UInput
              v-model="state.keterangan"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton
          icon="i-heroicons-x-mark-16-solid"
          variant="ghost"
          :disabled="isLoading"
          @click="modalOpen = false"
        >
          {{ state.id ? "Tutup" : "Batal" }}
        </UButton>
        <UButton
          v-if="!state.id"
          type="submit"
          icon="i-heroicons-check-16-solid"
          :loading="isLoading"
          form="penarikan-form"
        >
          Simpan
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <CrudCard :data="data" :delete-button="false" :add-function="clickAdd" />
      <AppTable
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            :label="
              row.original.status === 0
                ? 'Belom Disetujui'
                : row.original.status === 1
                  ? 'Disetujui'
                  : 'Ditolak'
            "
            :color="
              row.original.status === 0
                ? 'info'
                : row.original.status === 1
                  ? 'success'
                  : 'error'
            "
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
