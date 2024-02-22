<template>
  <Timeline
    title="Satellite images"
    :images="[]"
    v-if="!compareMapStore.isShowImageryLayersSplit"
  />

  <a-row
    v-else
    class="flex flex-1"
    :gutter="[16, 16]"
  >
    <a-col
      span="12"
      class="flex flex-col"
    >
      <Timeline
        :images="images1"
        :is-loading="isLoading1"
        :period="period1"
      />
    </a-col>
    <a-col
      span="12"
      class="flex flex-col"
    >
      <Timeline
        :images="images2"
        :is-loading="isLoading2"
        :period="period2"
      />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue';
import Timeline from '@/components/home/bottom/Timeline.vue';
import { useCompareMapStore } from '@/stores/compareMapStore';
import { useLayerStore } from '@/stores/LayerStore';
import { useImagesInMap } from '@/services/hooks/useMap';

// TODO: Define store
const compareMapStore = useCompareMapStore();
const layerStore = useLayerStore();

// TODO: Define period
const period1 = ref('');
const period2 = ref('');

// TODO: Define mapId
const mapBeforeId = ref<string>('');
const mapAfterId = ref<string>('');

// TODO: Check not empty of mapBeforeId and mapAfterId to cancel send request
const isEnableFetchImagesInMapBefore: ComputedRef<boolean> = computed(() => !!mapBeforeId.value);
const isEnableFetchImagesInMapAfter: ComputedRef<boolean> = computed(() => !!mapAfterId.value);

// TODO: Fetch images for period1 - before
const {
  data: imagesInPeriod1,
  isLoading: isLoading1,
  refetch: refetchFetchImagesPeriod1,
} = useImagesInMap(mapBeforeId, isEnableFetchImagesInMapBefore);
// TODO: Fetch images for period2 - after
const {
  data: imagesInPeriod2,
  isLoading: isLoading2,
  refetch: refetchFetchImagesPeriod2,
} = useImagesInMap(mapAfterId, isEnableFetchImagesInMapAfter);

// TODO: Setup for this components when Mounted into app
onMounted(() => {
  period1.value =
    layerStore.getLayerInfoById(compareMapStore.mapBeforeId)?.mapInfoDto.mapName || '';
  period2.value = layerStore.getLayerInfoById(compareMapStore.mapAfterId)?.mapInfoDto.mapName || '';
  refetchFetchImagesPeriod1();
  refetchFetchImagesPeriod2();
});

// TODO: watch event when change of  mapBeforeId in compareMapStore
watch(
  () => compareMapStore.mapBeforeId,
  () => {
    mapBeforeId.value = compareMapStore.mapBeforeId;
    period1.value =
      layerStore.getLayerInfoById(compareMapStore.mapBeforeId)?.mapInfoDto.mapName || '';
    refetchFetchImagesPeriod1();
  },
);

// TODO: watch event when change of  mapAfterId in compareMapStore
watch(
  () => compareMapStore.mapAfterId,
  () => {
    mapAfterId.value = compareMapStore.mapAfterId;
    period2.value =
      layerStore.getLayerInfoById(compareMapStore.mapAfterId)?.mapInfoDto.mapName || '';
    refetchFetchImagesPeriod2();
  },
);

// TODO: Extract images list from response
const images1 = computed(() => imagesInPeriod1?.value?.data || []);
const images2 = computed(() => imagesInPeriod2?.value?.data || []);
</script>
