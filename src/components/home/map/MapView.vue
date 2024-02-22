<template>
  <div
    class="flex flex-1 bg-[#636363]"
    :style="viewerStyle"
  >
    <div
      ref="cesiumContainerRef"
      :class="[
        'relative w-full h-full',
        isShowImageryLayersSplit &&
          'border-[2px] border-solid border-[#959595] rounded-sm overflow-hidden',
      ]"
    >
      <div
        id="slider"
        v-if="isShowImageryLayersSplit"
      />
      <div
        class="absolute top-3 left-4 bg-[#151515] bg-opacity-90 py-1 px-2 rounded-sm"
        style="z-index: 999"
        v-if="isShowImageryLayersSplit"
      >
        <a-typography-text class="font-bold text-xs text-white">
          {{ time1 }}
        </a-typography-text>
      </div>
      <div
        class="absolute top-3 right-4 bg-[#151515] bg-opacity-90 py-1 px-2 rounded-sm"
        style="z-index: 999"
        v-if="isShowImageryLayersSplit"
      >
        <a-typography-text class="font-bold text-xs text-white">
          {{ time2 }}
        </a-typography-text>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, type ComputedRef, type CSSProperties, onMounted, ref, watch } from 'vue';
import { useMapToolStore } from '@/stores/mapTool';
import { initMap } from '@/DTP_new/modules/map';
import { useCompareMapStore } from '@/stores/compareMapStore';
import { useLayerStore } from '@/stores/LayerStore';

const cesiumContainerRef = ref(null);

// When mount html into element, we will create a new cesium viewer
onMounted(async () => {
  initMap(cesiumContainerRef);
});

const mapToolStore = useMapToolStore();
// TODO: Define store
const compareMapStore = useCompareMapStore();
const layerStore = useLayerStore();
// TODO: Define time
const time1 = ref<string>('');
const time2 = ref<string>('');

// TODO: Watch compareMapStore
watch(
  () => compareMapStore.mapBeforeId,
  () => {
    time1.value =
      layerStore.getLayerInfoById(compareMapStore.mapBeforeId)?.mapInfoDto.mapName || '';
  },
);
watch(
  () => compareMapStore.mapAfterId,
  () => {
    time2.value = layerStore.getLayerInfoById(compareMapStore.mapAfterId)?.mapInfoDto.mapName || '';
  },
);

const isShowImageryLayersSplit = computed(() => compareMapStore.isShowImageryLayersSplit);

const viewerStyle: ComputedRef<CSSProperties> = computed(() => ({
  paddingTop: isShowImageryLayersSplit.value ? `66px` : undefined,
  paddingBottom: isShowImageryLayersSplit.value
    ? mapToolStore.isShowBottom
      ? `${195 + 12}px`
      : `60px`
    : undefined,
  paddingLeft: isShowImageryLayersSplit.value ? `${69 + 12 + 12}px` : undefined,
  paddingRight: isShowImageryLayersSplit.value ? `${12 + 283 + 12}px` : undefined,
}));
</script>

<style scoped>
#slider {
  position: absolute;
  left: 50%;
  top: 0;
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 999;
}

#slider:hover {
  cursor: ew-resize;
}
</style>
