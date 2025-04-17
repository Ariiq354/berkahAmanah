<script setup lang="ts">
  import { angsuranColumns, murabahahColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Monitoring / Pembiayaan");
  });

  const modalOpen = ref(false);
  const pembiayaanId = ref();
  const { data, status } = await useFetch(`/api/monitoring/pembiayaan`);
  const { data: dataAngsuran, status: statusAngsuran } = await useFetch(
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
  <Title>Monitoring | Pembiayaan</Title>
  <main>
    <LazyUModal v-model:open="modalOpen" title="Detail Angsuran">
      <template #body>
        <AppTable
          label="Monitoring Angsuran"
          :columns="angsuranColumns"
          :data="dataAngsuran"
          :loading="statusAngsuran === 'pending'"
          :action="false"
        >
          <template #jumlah-cell="{ row }">
            {{ row.original.jumlah.toLocaleString("id-ID") }}
          </template>
          <template #pokok-cell="{ row }">
            {{ row.original.pokok.toLocaleString("id-ID") }}
          </template>
          <template #margin-cell="{ row }">
            {{ row.original.margin.toLocaleString("id-ID") }}
          </template>
        </AppTable>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        label="Daftar Murabahah"
        :columns="murabahahColumns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #jumlah-cell="{ row }">
          {{ row.original.jumlah.toLocaleString("id-ID") }}
        </template>
        <template #pokok-cell="{ row }">
          {{ row.original.pokok.toLocaleString("id-ID") }}
        </template>
        <template #margin-cell="{ row }">
          {{ row.original.margin.toLocaleString("id-ID") }}
        </template>
        <template #total-cell="{ row }">
          {{
            (row.original.pokok + row.original.margin).toLocaleString("id-ID")
          }}
        </template>
        <template #angsuran-cell="{ row }">
          {{
            (
              (row.original.pokok + row.original.margin) /
              row.original.tempo
            ).toLocaleString("id-ID")
          }}
        </template>
        <template #sisa-cell="{ row }">
          {{ row.original.sisa.toLocaleString("id-ID") }}
        </template>
        <template #select-cell="{ row }">
          <UButton @click="clickUpdate(row.original.id)">Pilih</UButton>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
