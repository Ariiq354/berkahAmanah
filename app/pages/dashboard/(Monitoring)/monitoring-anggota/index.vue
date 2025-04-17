<script setup lang="ts">
  import { columns } from "./_constants";

  onMounted(() => {
    defineTopbarTitle("Monitoring / Anggota");
  });

  const { data, status } = await useFetch("/api/users");
</script>

<template>
  <main>
    <Title>Monitoring | Anggota</Title>
    <UCard>
      <AppTable
        label="Daftar Anggota"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        :action="false"
      >
        <template #noTelepon-cell="{ row }">
          <NuxtLink
            :href="`https://wa.me/${row.original.noTelepon}`"
            target="_blank"
          >
            {{ row.original.noTelepon }}
          </NuxtLink>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
