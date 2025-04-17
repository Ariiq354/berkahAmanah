<script setup lang="ts">
  import { columns, modalColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Simpanan / Monitoring");
  });

  const user = useUser();

  const modalOpen = ref(false);
  const jenis = ref();
  const { data, status } = await useFetch(
    () => `/api/monitoring/simpanan?anggotaId=${user.value?.id}`
  );

  function clickUpdate(item: any) {
    jenis.value = item.jenis;
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Simpanan | Monitoring</Title>
  <main>
    <LazyUModal
      v-model:open="modalOpen"
      :title="jenis === 'Saham' ? 'Detail Saham' : 'Detail Simpanan'"
      fullscreen
    >
      <template #body>
        <AppTable
          :columns="modalColumns"
          :data="jenis === 'Saham' ? data?.sahamDetail : data?.simpananDetail"
          :loading="status === 'pending'"
          :action="false"
        >
          <template #jumlah-cell="{ row }">
            {{ row.original.nilai.toLocaleString("id-ID") }}
          </template>
        </AppTable>
      </template>
    </LazyUModal>
    <UCard>
      <AppTable
        :columns="columns"
        :data="data?.data"
        :loading="status === 'pending'"
        @edit-click="clickUpdate"
      >
        <template #jumlahSimpanan-cell="{ row }">
          {{ row.original.jumlahSimpanan.toLocaleString("id-ID") }}
        </template>
        <template #jumlahLembar-cell="{ row }">
          {{
            row.original.jumlahLembar
              ? row.original.jumlahLembar.toLocaleString("id-ID")
              : ""
          }}
        </template>
        <template #persenSaham-cell="{ row }">
          {{
            row.original.persenSaham
              ? (row.original.persenSaham * 100).toFixed(2) + "%"
              : ""
          }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
