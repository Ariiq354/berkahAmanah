<script setup lang="ts">
  import { columns, tahunOptions } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Laporan keuangan / Neraca");
  });

  const tahun = ref();
  const { data: pendapatan, status: statusPendapatan } = await useFetch(
    "/api/keuangan/pendapatan",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: biaya, status: statusBiaya } = await useFetch(
    "/api/keuangan/biaya",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
</script>

<template>
  <main>
    <Title>Laporan keuangan | Neraca</Title>
    <UCard class="mb-4">
      <UFormField label="Tahun">
        <USelectMenu v-model="tahun" :items="tahunOptions" />
      </UFormField>
    </UCard>
    <UCard>
      <AppTable
        label="Daftar Pendapatan"
        :loading="statusPendapatan === 'pending'"
        :data="pendapatan"
        :columns="columns"
        :action="false"
      >
        <template #total-cell="{ row }">
          {{
            row.original.jan +
            row.original.feb +
            row.original.mar +
            row.original.apr +
            row.original.may +
            row.original.jun +
            row.original.jul +
            row.original.aug +
            row.original.sep +
            row.original.oct +
            row.original.nov +
            row.original.dec
          }}
        </template>
      </AppTable>
      <AppTable
        label="Daftar Biaya"
        :loading="statusBiaya === 'pending'"
        :data="biaya"
        :columns="columns"
        :action="false"
      >
        <template #total-cell="{ row }">
          {{
            row.original.jan +
            row.original.feb +
            row.original.mar +
            row.original.apr +
            row.original.may +
            row.original.jun +
            row.original.jul +
            row.original.aug +
            row.original.sep +
            row.original.oct +
            row.original.nov +
            row.original.dec
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
