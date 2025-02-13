<script setup lang="ts">
  import { galonColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Athar / Monitoring");
  });

  const { data, status } = await useLazyFetch(
    "/api/penjualan-athar/monitoring"
  );
</script>

<template>
  <main>
    <Title>Athar | Monitoring</Title>
    <UCard>
      <AppTable
        label="Daftar Galon"
        :columns="galonColumns"
        :data="data"
        :loading="status === 'pending'"
        :action="false"
      >
        <template #price-data="{ row }">
          {{ row.price.toLocaleString("id-ID") }}
        </template>
        <template #nilaiPenjualan-data="{ row }">
          {{ row.nilaiPenjualan.toLocaleString("id-ID") }}
        </template>
        <template #nilaiPembelian-data="{ row }">
          {{ row.nilaiPembelian.toLocaleString("id-ID") }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
