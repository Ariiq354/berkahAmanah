<script setup lang="ts">
  import { columns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Daftar Anggota");
  });

  const { data, status } = await useLazyFetch("/api/users");
</script>

<template>
  <main>
    <Title>Daftar User</Title>
    <UCard
      :ui="{
        body: {
          padding: 'sm:p-8',
        },
      }"
    >
      <AppTable
        label="Daftar Anggota"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        :action="false"
      >
        <template #noTelepon-data="{ row }">
          <NuxtLink :href="`https://wa.me/${row.noTelepon}`" target="_blank">
            {{ row.noTelepon }}
          </NuxtLink>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
