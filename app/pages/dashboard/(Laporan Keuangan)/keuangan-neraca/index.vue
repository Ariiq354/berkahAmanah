<script setup lang="ts">
  import { columns, tahunOptions } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Laporan keuangan / Neraca");
  });

  const tahun = ref();
  const { data: aktiva, status: statusAktiva } = await useFetch(
    "/api/keuangan/aktiva",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: hutang, status: statusHutang } = await useFetch(
    "/api/keuangan/hutang",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: modal, status: statusModal } = await useFetch(
    "/api/keuangan/modal",
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
        label="Daftar Aktiva"
        :loading="statusAktiva === 'pending'"
        :data="aktiva"
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
        label="Daftar Hutang"
        :loading="statusHutang === 'pending'"
        :data="hutang"
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
        label="Daftar Modal"
        :loading="statusModal === 'pending'"
        :data="modal"
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
