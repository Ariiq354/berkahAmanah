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

  const user = useUser();

  const state = ref(getInitialFormData());
  const { data, status, refresh } = await useFetch("/api/setoran");
  const { data: saham } = await useFetch("/api/saham/now");
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
  <Title>Simpanan | Setoran</Title>
  <main>
    <LazyUModal
      v-model:open="modalOpen"
      :title="(state.id ? 'Detail' : 'Tambah') + ' Setoran'"
    >
      <template #body>
        <UForm
          id="setoran-form"
          :schema="
            state.jenis === 'Saham'
              ? createSchema(saham!.nilai * state!.jumlahSaham!)
              : createSchema()
          "
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
          <UFormField label="Jenis Setoran" name="jenis">
            <USelectMenu
              v-model="state.jenis"
              :items="jenisOptions"
              label-key="name"
              value-key="value"
              :disabled="isLoading || !!state.id"
            />
          </UFormField>
          <UFormField v-if="state.jenis === 'Simpanan'" label="Saldo Simpanan">
            <UInput :model-value="saldo?.saldo" type="number" disabled />
          </UFormField>
          <div v-if="state.jenis === 'Saham'" class="grid grid-cols-3 gap-2">
            <UFormField label="Jumlah Saham" name="jumlahSaham">
              <UInput
                v-model="state.jumlahSaham"
                type="number"
                :disabled="isLoading || !!state.id"
                min="0"
              />
            </UFormField>
            <UFormField label="Harga Dasar">
              <UInput
                :model-value="
                  (50000 * state!.jumlahSaham!).toLocaleString('id-ID')
                "
                disabled
              />
            </UFormField>
            <UFormField label="Harga Saham">
              <UInput
                :model-value="
                  (saham!.nilai * state!.jumlahSaham!).toLocaleString('id-ID')
                "
                disabled
              />
            </UFormField>
          </div>
          <UFormField label="Nilai Setoran" name="nilai">
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
          form="setoran-form"
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
        <template #harga-cell="{ row }">
          {{ row.original.jenis === "Saham" ? "50.000" : "0" }}
        </template>
        <template #agio-cell="{ row }">
          {{
            row.original.jenis === "Saham"
              ? (row.original.nilai - 50000).toLocaleString("id-ID")
              : 0
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
