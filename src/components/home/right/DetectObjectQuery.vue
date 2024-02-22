<template>
  <div
    class="right-content rounded-sm flex flex-col absolute right-3 z-50 bg-[#151515] bg-opacity-90"
    :style="{
      height: remainHeight - 32 - 24 + 'px',
    }"
    v-if="mapToolStore.isShowDetectObjectQuery"
  >
    <HeaderChart
      :title="
        mapToolStore.isShowAIDetectObjectResult
          ? t('home.bottom.detectObject')
          : t('home.bottom.detectObject')
      "
      :show-back-button="mapToolStore.isShowAIDetectObjectResult"
      :on-back="() => (mapToolStore.isShowAIDetectObjectResult = false)"
    />

    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import useWindowResize from '@/utils/hooks';
import HeaderChart from '@/components/home/right/charts/HeaderChart.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { shallowRef, watch } from 'vue';
import DetectObjectForm from '@/components/home/right/DetectObjectForm.vue';
import DetectObjectChart from '@/components/home/right/charts/DetectObjectChart.vue';
import { useI18n } from 'vue-i18n';

const mapToolStore = useMapToolStore();
const { remainHeight } = useWindowResize();
const current = shallowRef(DetectObjectForm);
const { t } = useI18n();
watch(
  () => mapToolStore.isShowAIDetectObjectResult,
  () => {
    if (mapToolStore.isShowAIDetectObjectResult) {
      current.value = DetectObjectChart;
    } else {
      current.value = DetectObjectForm;
    }
  },
);
</script>
