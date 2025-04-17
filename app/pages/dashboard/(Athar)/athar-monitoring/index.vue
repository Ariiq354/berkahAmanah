<script setup lang="ts">
  import { galonColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Monitoring");
  });

  const { data, status } = await useFetch("/api/penjualan-athar/monitoring");
</script>

<template>
  <Title>Athar | Monitoring</Title>
  <main>
    <UCard>
      <AppTable
        label="Daftar Galon"
        :columns="galonColumns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #price-cell="{ row }">
          {{ row.original.price.toLocaleString("id-ID") }}
        </template>
        <template #nilaiPenjualan-cell="{ row }">
          {{ row.original.nilaiPenjualan.toLocaleString("id-ID") }}
        </template>
        <template #nilaiPembelian-cell="{ row }">
          {{ row.original.nilaiPembelian.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
