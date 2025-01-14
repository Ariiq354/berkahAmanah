<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Pembiayaan / Murabahah");
  });

  const { data: anggota } = await useLazyFetch("/api/users");
  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/murabahah");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/murabahah",
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
  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Pembiayaan | Murabahah</Title>
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
        <UFormGroup label="Nama Anggota" name="anggotaId">
          <USelectMenu
            v-model="state.anggotaId"
            :options="anggota"
            option-attribute="namaLengkap"
            value-attribute="id"
            :disabled="isLoading || !!state.id"
          />
        </UFormGroup>
        <div class="class grid grid-cols-2 gap-4">
          <UFormGroup label="Jumlah Pengajuan" name="jumlah">
            <UInput
              v-model="state.jumlah"
              type="number"
              :disabled="isLoading || !!state.id"
            />
          </UFormGroup>
          <UFormGroup label="Tempo" name="tempo">
            <UInput
              v-model="state.tempo"
              type="number"
              :disabled="isLoading || !!state.id"
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Tujuan Pengajuan" name="tujuan">
          <UInput v-model="state.tujuan" :disabled="isLoading || !!state.id" />
        </UFormGroup>
        <UFormGroup label="Catatan" name="catatan">
          <UInput v-model="state.catatan" :disabled="isLoading || !!state.id" />
        </UFormGroup>

        <div class="flex w-full justify-end gap-2">
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
          >
            Setuju
          </UButton>
        </div>
      </UForm>
    </LazyAppModal>
    <UCard>
      <CrudCard :data="data" :delete-button="false" :add-function="clickAdd" />
      <AppTable
        label="Kelola Murabahah"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="
              row.status === 0
                ? 'Belom Disetujui'
                : row.status === 1
                  ? 'Disetujui'
                  : 'Ditolak'
            "
            :color="
              row.status === 0 ? 'blue' : row.status === 1 ? 'green' : 'red'
            "
            variant="solid"
            class="rounded-full"
          />
        </template>
        <template #jumlah-data="{ row }">
          {{ row.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-data="{ row }">
          {{
            row.status === 1 ? row.nilaiPersetujuan.toLocaleString("id-ID") : 0
          }}
        </template>
        <template #margin-data="{ row }">
          {{
            row.status === 1 ? row.marginPersetujuan.toLocaleString("id-ID") : 0
          }}
        </template>
        <template #total-data="{ row }">
          {{
            row.status === 1
              ? (row.nilaiPersetujuan + row.marginPersetujuan).toLocaleString(
                  "id-ID"
                )
              : 0
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
