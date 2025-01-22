<script setup lang="ts">
  import { bulanLabels, tahunLabels } from "./constants";

  defineTopbarTitle("Dashboard");

  const { data } = useLazyFetch("/api/dashboard");
  const dataAthar = computed(() => {
    return data.value?.dataAthar;
  });
  const dataSaham = computed(() => {
    return data.value?.dataSaham;
  });
  const dataPembiayaan = computed(() => {
    return data.value?.dataPembiayaan;
  });

  const labaDatasets = [
    {
      label: "Profit",
      data: [24, 32, 60, 75, 62, 12, 89],
      borderWidth: 1,
    },
  ];
  const atharDatasets = [
    {
      label: "Penjualan Athar",
      data: dataAthar.value!,
      borderWidth: 1,
    },
  ];
  const sahamDatasets = [
    {
      label: "Nilai Saham",
      data: dataSaham.value!,
      fill: true,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4,
    },
  ];
  const pembiayaanDatasets = [
    {
      label: "Pembiayaan",
      data: dataPembiayaan.value!,
      borderWidth: 1,
    },
  ];
</script>

<template>
  <main>
    <div
      class="grid grid-cols-1 gap-4 text-white sm:grid-cols-2 md:grid-cols-4"
    >
      <UCard class="bg-[#716aca] shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-4">
            <UIcon name="i-heroicons-presentation-chart-bar" size="48" />
          </div>
          <div class="flex flex-col">
            <p>Pemilik Saham</p>
            <p class="text-lg">{{ data?.pemilikSaham }}</p>
          </div>
        </div>
      </UCard>
      <UCard class="bg-[#ffa534] shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-4">
            <UIcon name="i-heroicons-users" size="48" />
          </div>
          <div class="flex flex-col">
            <p>Pemilik Tabungan</p>
            <p class="text-lg">{{ data?.pemilikTabungan }}</p>
          </div>
        </div>
      </UCard>
      <UCard class="bg-[#36a3f7] shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-4">
            <UIcon name="i-heroicons-newspaper" size="48" />
          </div>
          <div class="flex flex-col">
            <p>Nasabah Pembiayaan</p>
            <p class="text-lg">{{ data?.nasabahPembiayaan }}</p>
          </div>
        </div>
      </UCard>
      <UCard class="bg-[#35cd3a] shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-4">
            <UIcon name="i-heroicons-calendar-days" size="48" />
          </div>
          <div class="flex flex-col">
            <p>Antrian Pembiayaan</p>
            <p class="text-lg">{{ data?.antrianPembiayaan }}</p>
          </div>
        </div>
      </UCard>
    </div>
    <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
      <div class="rounded-lg bg-white">
        <div class="flex flex-col gap-4">
          <p class="border-b p-4 text-xl">Grafik Pertumbuhan Laba</p>
          <div class="p-4">
            <ChartBar :labels="tahunLabels" :datasets="labaDatasets" />
          </div>
        </div>
      </div>
      <div class="rounded-lg bg-white">
        <div class="flex flex-col gap-4">
          <p class="border-b p-4 text-xl">Grafik Penjualan Athar</p>
          <div class="p-4">
            <ChartBar
              v-if="data"
              :labels="bulanLabels"
              :datasets="atharDatasets"
            />
          </div>
        </div>
      </div>
      <div class="rounded-lg bg-white">
        <div class="flex flex-col gap-4">
          <p class="border-b p-4 text-xl">Grafik Pertumbuhan Nilai Saham</p>
          <div class="p-4">
            <ChartLine
              v-if="data"
              :labels="tahunLabels"
              :datasets="sahamDatasets"
            />
          </div>
        </div>
      </div>
      <div class="rounded-lg bg-white">
        <div class="flex flex-col gap-4">
          <p class="border-b p-4 text-xl">Grafik Pembiayaan</p>
          <div class="p-4">
            <ChartBar
              v-if="data"
              :labels="tahunLabels"
              :datasets="pembiayaanDatasets"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
