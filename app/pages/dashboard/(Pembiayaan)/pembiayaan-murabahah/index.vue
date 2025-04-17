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

  const user = useUser();

  const { data: anggota } = await useFetch("/api/users");
  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/murabahah");

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
  <Title>Pembiayaan | Murabahah</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Murabahah">
      <template #body>
        <UForm
          id="murabahah-form"
          :schema="schema"
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
          <div class="class grid grid-cols-2 gap-4">
            <UFormField label="Jumlah Pengajuan" name="jumlah">
              <UInput
                v-model="state.jumlah"
                type="number"
                :disabled="isLoading || !!state.id"
              />
            </UFormField>
            <UFormField label="Tempo" name="tempo">
              <UInput
                v-model="state.tempo"
                type="number"
                :disabled="isLoading || !!state.id"
              />
            </UFormField>
          </div>
          <UFormField label="Tujuan Pengajuan" name="tujuan">
            <UInput
              v-model="state.tujuan"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
          <UFormField label="Catatan" name="catatan">
            <UInput
              v-model="state.catatan"
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
          form="murabahah-form"
        >
          Setuju
        </UButton>
      </template>
    </LazyUModal>
    <UCard>
      <CrudCard :data="data" :delete-button="false" :add-function="clickAdd" />
      <AppTable
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :select="false"
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
        <template #jumlah-cell="{ row }">
          {{ row.original.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-cell="{ row }">
          {{
            row.original.status === 1
              ? row.original.nilaiPersetujuan.toLocaleString("id-ID")
              : 0
          }}
        </template>
        <template #margin-cell="{ row }">
          {{
            row.original.status === 1
              ? row.original.marginPersetujuan.toLocaleString("id-ID")
              : 0
          }}
        </template>
        <template #total-cell="{ row }">
          {{
            row.original.status === 1
              ? (
                  row.original.nilaiPersetujuan + row.original.marginPersetujuan
                ).toLocaleString("id-ID")
              : 0
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
