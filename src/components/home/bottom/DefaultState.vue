<template>
  <Timeline
    :title="t('home.bottom.satelliteImages')"
    :images="images"
    :is-loading="isLoading"
    :period="period"
  />
</template>

<!-- SCRIPT CODE -------------------------------------------------------------------------------------------------- !-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import Timeline from '@/components/home/bottom/Timeline.vue';
import { useImagesInMap } from '@/services/hooks/useMap';
import { useLayerStore } from '@/stores/LayerStore';
import { removeAllImages } from '@/DTP_new/modules/image';
import { useI18n } from 'vue-i18n';

// TODO: Define store
const layerStore = useLayerStore();
const { t } = useI18n();
// TODO: Fetch image in Map with map Id
const baseMapId = ref<string>('');
const period = ref<string>('');
const isEnableFetchImagesInMap: ComputedRef<boolean> = computed(() => !!baseMapId.value);
const { data, isLoading, refetch } = useImagesInMap(baseMapId, isEnableFetchImagesInMap);

// TODO: Check OnMounted
onMounted(() => {
  baseMapId.value = layerStore.baseMapId;
  // console.log('baseMapId', baseMapId);
  period.value = layerStore.getLayerInfoById(baseMapId.value)?.mapInfoDto.mapName || '';
  removeAllImages(); // remove all image entities in viewer
  refetch(); // refetch api to get images in map
});
// TODO: Watch baseMapId - when change base map, auto change image follow by baseMapId
watch(
  () => layerStore.baseMapId,
  () => {
    baseMapId.value = layerStore.baseMapId;
    // console.log('baseMapId', baseMapId);
    //console.log('layer Info', layerStore.getLayerInfoById(baseMapId.value));
    period.value = layerStore.getLayerInfoById(baseMapId.value)?.mapInfoDto.mapName || '';
    removeAllImages(); // remove all image entities in viewer
    refetch(); // refetch api to get images in map
  },
);

// TODO: Extract images list from response
const images = computed(() => data?.value?.data);
</script>
