<script setup lang="ts">
  import { columns, modalColumns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Monitoring / Simpanan");
  });

  const modalOpen = ref(false);
  const jenis = ref();
  const anggotaId = ref();
  const { data, status } = await useFetch(`/api/monitoring/simpanan`, {
    immediate: false,
    query: {
      anggotaId,
    },
  });
  const { data: dataAnggota } = await useFetch("/api/users");

  function clickUpdate(item: any) {
    jenis.value = item.jenis;
    modalOpen.value = true;
  }
</script>

<template>
  <Title>Monitoring | Simpanan</Title>
  <main>
    <LazyUModal
      v-model:open="modalOpen"
      :title="jenis === 'Saham' ? 'Detail Saham' : 'Detail Simpanan'"
    >
      <template #body>
        <AppTable
          :label="
            jenis === 'Saham' ? 'Monitoring Saham' : 'Monitoring Simpanan'
          "
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
    <UCard class="mb-4">
      <UFormField label="Nama Anggota">
        <USelectMenu
          v-model="anggotaId"
          :items="dataAnggota"
          placeholde="Pilih Anggota"
          label-key="namaLengkap"
          value-key="id"
        />
      </UFormField>
    </UCard>
    <UCard>
      <AppTable
        label="Monitoring Simpanan"
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
