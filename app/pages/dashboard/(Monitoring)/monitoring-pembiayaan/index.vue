<script setup lang="ts">
  import { angsuranColumns, murabahahColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Monitoring / Pembiayaan");
  });

  const modalOpen = ref(false);
  const pembiayaanId = ref();
  const { data, status } = await useLazyFetch(`/api/monitoring/pembiayaan`);
  const { data: dataAngsuran, status: statusAngsuran } = await useLazyFetch(
    "/api/angsuran/anggota",
    {
      immediate: false,
      query: {
        pembiayaanId: pembiayaanId,
      },
    }
  );

  function clickUpdate(id: number) {
    pembiayaanId.value = id;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Monitoring | Pembiayaan</Title>
    <LazyAppModal
      v-model="modalOpen"
      title="Detail Angsuran"
      :pending="false"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <AppTable
        label="Monitoring Angsuran"
        :columns="angsuranColumns"
        :data="dataAngsuran"
        :loading="statusAngsuran === 'pending'"
        :action="false"
      >
        <template #jumlah-data="{ row }">
          {{ row.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-data="{ row }">
          {{ row.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-data="{ row }">
          {{ row.margin.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </LazyAppModal>
    <UCard>
      <AppTable
        label="Daftar Murabahah"
        :columns="murabahahColumns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #jumlah-data="{ row }">
          {{ row.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-data="{ row }">
          {{ row.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-data="{ row }">
          {{ row.margin.toLocaleString("id-ID") }}
        </template>
        <template #total-data="{ row }">
          {{ (row.pokok + row.margin).toLocaleString("id-ID") }}
        </template>
        <template #angsuran-data="{ row }">
          {{ ((row.pokok + row.margin) / row.tempo).toLocaleString("id-ID") }}
        </template>
        <template #sisa-data="{ row }">
          {{ row.sisa.toLocaleString("id-ID") }}
        </template>
        <template #select-data="{ row }">
          <UButton @click="clickUpdate(row.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
