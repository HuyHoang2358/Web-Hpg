<template>
  <div
    class="flex flex-col px-4 relative"
    :style="{ height: remainHeight - 40 - 16 - 32 + 'px' }"
  >
    <Bar
      :data="chartData"
      :options="stackedBarChartOptions"
    />
  </div>
</template>

<script setup lang="ts">
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
import useWindowResize from '@/utils/hooks';
import { coating, objects, stackedBarChartOptions } from '@/utils/constants';
import { computed, toRaw, watch } from 'vue';
import { changeChartLabels } from '@/DTP/common';
import { useMapToolStore } from '@/stores/mapTool';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartJsPluginDataLabels,
);

const mapToolStore = useMapToolStore();

const { remainHeight } = useWindowResize();

watch(
  () => mapToolStore.detectObjectStatisticData,
  () => {
    console.log(
      'mapToolStore.detectObjectStatisticData',
      toRaw(mapToolStore.detectObjectStatisticData),
    );
  },
);

const chartData = computed(() => {
  if (!mapToolStore.detectObjectStatisticData) {
    return;
  }

  return {
    labels: changeChartLabels(mapToolStore.detectObjectStatisticData.labels),
    datasets:
      objects.map((e) => {
        return {
          label: e.vn_name,
          data: mapToolStore.detectObjectStatisticData?.data.map((item) => item.number) || [],
          fill: false,
          backgroundColor: [`#FFFC8C`],
        };
      }) || [],
  };
});
</script>
