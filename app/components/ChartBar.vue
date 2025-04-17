<script setup lang="ts">
  import { Bar } from "vue-chartjs";
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Colors,
  } from "chart.js";

  Chart.register(
    Colors,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const { labels = [], datasets = [] } = defineProps<{
    labels?: string[];
    datasets?: {
      label: string;
      data: number[];
      borderWidth?: number;
    }[];
  }>();
</script>

<template>
  <Bar
    id="my-chart-id"
    :data="{
      datasets,
      labels,
    }"
    :items="{
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }"
  />
</template>
