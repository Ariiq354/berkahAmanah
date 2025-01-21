<script setup lang="ts">
  import { columns, tahunOptions } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Laporan keuangan / Neraca");
  });

  const tahun = ref();
  const { data: pendapatan, status: statusPendapatan } = await useLazyFetch(
    "/api/keuangan/pendapatan",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: biaya, status: statusBiaya } = await useLazyFetch(
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
      <UFormGroup label="Tahun">
        <USelectMenu v-model="tahun" :options="tahunOptions" />
      </UFormGroup>
    </UCard>
    <UCard>
      <AppTable
        label="Daftar Pendapatan"
        :loading="statusPendapatan === 'pending'"
        :data="pendapatan"
        :columns="columns"
        :action="false"
      >
        <template #total-data="{ row }">
          {{
            row.jan +
            row.feb +
            row.mar +
            row.apr +
            row.may +
            row.jun +
            row.jul +
            row.aug +
            row.sep +
            row.oct +
            row.nov +
            row.dec
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
        <template #total-data="{ row }">
          {{
            row.jan +
            row.feb +
            row.mar +
            row.apr +
            row.may +
            row.jun +
            row.jul +
            row.aug +
            row.sep +
            row.oct +
            row.nov +
            row.dec
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
