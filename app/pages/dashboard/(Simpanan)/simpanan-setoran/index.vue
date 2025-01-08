<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    jenisOptions,
    createSchema,
    type Schema,
  } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Simpanan / Setoran");
  });

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useLazyFetch("/api/setoran");
  const { data: saham } = await useLazyFetch("/api/saham/now");
  const { data: saldo, refresh: refreshSaldo } = await useLazyFetch(
    () => `/api/setoran/saldo?anggotaId=${state.value.anggotaId}`
  );
  const { data: anggota } = await useLazyFetch("/api/users");

  const modalOpen = ref(false);
  const { isLoading, execute } = useSubmit();
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await execute({
      path: "/api/setoran",
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
  }
  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Simpanan | Setoran</Title>
    <LazyAppModal
      v-model="modalOpen"
      :title="(state.id ? 'Detail' : 'Tambah') + ' Setoran'"
      :pending="isLoading"
      :ui="{ width: 'OlaSeni:max-w-4xl' }"
    >
      <UForm
        :schema="
          state.jenis === 'Saham'
            ? createSchema(saham!.nilai * state!.jumlahSaham!)
            : createSchema()
        "
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
        <UFormGroup label="Jenis Setoran" name="jenis">
          <USelectMenu
            v-model="state.jenis"
            :options="jenisOptions"
            option-attribute="name"
            value-attribute="value"
            :disabled="isLoading || !!state.id"
          />
        </UFormGroup>
        <UFormGroup v-if="state.jenis === 'Simpanan'" label="Saldo Simpanan">
          <UInput :model-value="saldo?.saldo" type="number" disabled />
        </UFormGroup>
        <div v-if="state.jenis === 'Saham'" class="grid grid-cols-3 gap-2">
          <UFormGroup label="Jumlah Saham" name="jumlahSaham">
            <UInput
              v-model="state.jumlahSaham"
              type="number"
              :disabled="isLoading || !!state.id"
              min="0"
            />
          </UFormGroup>
          <UFormGroup label="Harga Dasar">
            <UInput
              :model-value="
                (50000 * state!.jumlahSaham!).toLocaleString('id-ID')
              "
              disabled
            />
          </UFormGroup>
          <UFormGroup label="Harga Saham">
            <UInput
              :model-value="
                (saham!.nilai * state!.jumlahSaham!).toLocaleString('id-ID')
              "
              disabled
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Nilai Setoran" name="nilai">
          <UInput
            v-model="state.nilai"
            type="number"
            min="0"
            :disabled="isLoading || !!state.id"
          />
        </UFormGroup>
        <UFormGroup label="Tanggal" name="tanggal">
          <UInput
            v-model="state.tanggal"
            type="date"
            :disabled="isLoading || !!state.id"
          />
        </UFormGroup>
        <UFormGroup label="Keterangan" name="keterangan">
          <UInput
            v-model="state.keterangan"
            :disabled="isLoading || !!state.id"
          />
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
      <CrudCard :data="data" :delete-button="false" :add-function="clickAdd" />
      <AppTable
        label="Kelola Setoran"
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
        <template #nilai-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
        <template #harga-data="{ row }">
          {{ row.jenis === "Saham" ? "50.000" : "0" }}
        </template>
        <template #agio-data="{ row }">
          {{
            row.jenis === "Saham"
              ? (row.nilai - 50000).toLocaleString("id-ID")
              : 0
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
