<script setup lang="ts">
  import { Line } from "vue-chartjs";
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Colors,
    Filler,
  } from "chart.js";

  Chart.register(
    Colors,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler
  );

  const { labels, datasets } = defineProps<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderWidth?: number;
      fill?: boolean;
    }[];
  }>();
</script>

<template>
  <Line
    id="my-chart-id"
    :data="{
      datasets,
      labels,
    }"
    :options="{
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }"
  />
</template>
