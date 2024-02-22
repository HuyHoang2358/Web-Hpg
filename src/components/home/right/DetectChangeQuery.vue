<template>
  <div
    class="right-content rounded-sm flex flex-col absolute right-3 z-50 bg-[#151515] bg-opacity-90"
    :style="{
      height: remainHeight - 32 - 24 + 'px',
    }"
    v-if="compareMapStore.isShowDetectChangeQuery"
  >
    <HeaderChart
      :title="
        compareMapStore.isShowAIDetectChangeResult
          ? t('home.aiResult')
          : t('home.bottom.detectChange')
      "
      :show-back-button="compareMapStore.isShowAIDetectChangeResult"
      :on-back="() => (compareMapStore.isShowAIDetectChangeResult = false)"
    />

    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import HeaderChart from '@/components/home/right/charts/HeaderChart.vue';
import DetectChangeForm from '@/components/home/right/DetectChangeForm.vue';
import AIResultChart from '@/components/home/right/charts/AIResultChart.vue';
import { shallowRef, watch } from 'vue';
import { useCompareMapStore } from '@/stores/compareMapStore';
import useWindowResize from '@/utils/hooks';
import { useI18n } from 'vue-i18n';

const { remainHeight } = useWindowResize();
const compareMapStore = useCompareMapStore();
const current = shallowRef(DetectChangeForm);
const { t } = useI18n();

// TODO: Watch store to show
watch(
  () => compareMapStore.isShowAIDetectChangeResult,
  () => {
    if (compareMapStore.isShowAIDetectChangeResult) {
      current.value = AIResultChart;
    } else {
      current.value = DetectChangeForm;
    }
  },
);
</script>
