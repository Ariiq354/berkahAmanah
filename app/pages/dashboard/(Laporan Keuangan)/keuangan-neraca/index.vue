<script setup lang="ts">
  import { columns, tahunOptions } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Laporan keuangan / Neraca");
  });

  const tahun = ref();
  const { data: aktiva, status: statusAktiva } = await useLazyFetch(
    "/api/keuangan/aktiva",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: hutang, status: statusHutang } = await useLazyFetch(
    "/api/keuangan/hutang",
    {
      query: {
        tahun,
      },
      immediate: false,
    }
  );
  const { data: modal, status: statusModal } = await useLazyFetch(
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
      <UFormGroup label="Tahun">
        <USelectMenu v-model="tahun" :options="tahunOptions" />
      </UFormGroup>
    </UCard>
    <UCard>
      <AppTable
        label="Daftar Aktiva"
        :loading="statusAktiva === 'pending'"
        :data="aktiva"
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
        label="Daftar Hutang"
        :loading="statusHutang === 'pending'"
        :data="hutang"
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
        label="Daftar Modal"
        :loading="statusModal === 'pending'"
        :data="modal"
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
