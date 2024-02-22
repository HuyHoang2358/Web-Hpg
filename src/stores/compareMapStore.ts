import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChangeDetectionChart } from '@/DTP_new/libs/DTP.type';

export const useCompareMapStore = defineStore('compareMapStore', () => {
  // state define
  const isShowImageryLayersSplit = ref(false);
  const isShowButtonAIDetectChange = ref(false);
  const isShowAIDetectChangeResult = ref(false);
  const isShowDetectChangeQuery = ref(false);
  const isShowOpacity = ref(false);
  const dataChangeDetectionChart = ref<ChangeDetectionChart>();
  const mapBeforeId = ref('');
  const mapAfterId = ref('');

  return {
    isShowImageryLayersSplit,
    isShowButtonAIDetectChange,
    isShowAIDetectChangeResult,
    isShowDetectChangeQuery,
    dataChangeDetectionChart,
    isShowOpacity,
    mapBeforeId,
    mapAfterId,
  };
});
