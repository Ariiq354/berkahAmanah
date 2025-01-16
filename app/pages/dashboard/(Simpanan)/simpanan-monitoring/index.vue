<script setup lang="ts">
  import { columns, modalColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Simpanan / Monitoring");
  });

  const user = useUser();

  const modalOpen = ref(false);
  const jenis = ref();
  const { data, status } = await useLazyFetch(
    () => `/api/monitoring/simpanan?anggotaId=${user.value?.id}`
  );

  function clickUpdate(item: any) {
    jenis.value = item.jenis;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <Title>Simpanan | Monitoring</Title>
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
