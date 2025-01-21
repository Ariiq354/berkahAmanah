<script setup lang="ts">
  import { columns, modalColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Monitoring / Simpanan");
  });

  const modalOpen = ref(false);
  const jenis = ref();
  const anggotaId = ref();
  const { data, status } = await useLazyFetch(`/api/monitoring/simpanan`, {
    immediate: false,
    query: {
      anggotaId,
    },
  });
  const { data: dataAnggota } = await useLazyFetch("/api/users");

  function clickUpdate(item: any) {
    jenis.value = item.jenis;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Monitoring | Simpanan</Title>
    <LazyAppModal
      v-model="modalOpen"
      :title="jenis === 'Saham' ? 'Detail Saham' : 'Detail Simpanan'"
      :pending="false"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <AppTable
        :label="jenis === 'Saham' ? 'Monitoring Saham' : 'Monitoring Simpanan'"
        :columns="modalColumns"
        :data="jenis === 'Saham' ? data?.sahamDetail : data?.simpananDetail"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #jumlah-data="{ row }">
          {{ row.nilai.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </LazyAppModal>
    <UCard class="mb-4">
      <UFormGroup label="Nama Anggota">
        <USelectMenu
          v-model="anggotaId"
          :options="dataAnggota"
          placeholde="Pilih Anggota"
          option-attribute="namaLengkap"
          value-attribute="id"
        />
      </UFormGroup>
    </UCard>
    <UCard>
      <AppTable
        label="Monitoring Simpanan"
        :columns="columns"
        :data="data?.data"
        :loading="status === 'pending'"
        @edit-click="clickUpdate"
      >
        <template #jumlahSimpanan-data="{ row }">
          {{ row.jumlahSimpanan.toLocaleString("id-ID") }}
        </template>
        <template #jumlahLembar-data="{ row }">
          {{ row.jumlahLembar ? row.jumlahLembar.toLocaleString("id-ID") : "" }}
        </template>
        <template #persenSaham-data="{ row }">
          {{ row.persenSaham ? (row.persenSaham * 100).toFixed(2) + "%" : "" }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
