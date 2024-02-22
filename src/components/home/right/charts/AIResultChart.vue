<template>
  <div
    class="flex flex-col px-4 relative"
    :style="{ height: remainHeight - 40 - 16 - 32 + 'px' }"
  >
    <Bar
      :data="chartData"
      :options="horizontalBarChartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';
import type { ChartData } from 'chart.js';
import useWindowResize from '@/utils/hooks';
import { horizontalBarChartOptions } from '@/utils/constants';
import { useCompareMapStore } from '@/stores/compareMapStore';

// TODO: Register Chart
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartJsPluginDataLabels,
);
const { remainHeight } = useWindowResize();

// TODO: Define Store
const compareMapStore = useCompareMapStore();

// TODO: Init chart to show
const chartData: ComputedRef<ChartData<'bar'>> = computed(() => {
  return {
    labels: compareMapStore.dataChangeDetectionChart?.labels || [],
    datasets: [
      {
        label: 'Number of changes',
        data: compareMapStore.dataChangeDetectionChart?.data || [],
        backgroundColor: ['rgba(208, 0, 45, 0.8)'],
        hoverBackgroundColor: ['rgba(208, 0, 45, 1)'],
      },
    ],
  };
});
</script>
