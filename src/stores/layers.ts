import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { LayerResType, OptionType } from '@/DTP/DTP.type';
import { Entity, ImageryLayer } from 'cesium';

export const useLayersStore = defineStore('layer', () => {
  const baseLayers = ref<ImageryLayer[]>([]);
  const baseLayerInfo = ref<LayerResType>();
  const layers = ref<Map<string, ImageryLayer>>(new Map());
  const layersDisplayed = ref<LayerResType[]>([]);
  const isShowLayersDisplayed = computed(() => layersDisplayed.value.length !== 0);
  const images = ref<Map<string, Entity>>(new Map());

  const allLayers = ref<LayerResType[]>([]);
  const resolutionOptions = ref<OptionType[]>([]);
  const selectingResolution = ref<string>('');
  const selectingAIFunction = ref<string>('');
  const layerFirstId = ref<string>('');
  const layerSecondId = ref<string>('');

  const imageIds = computed(() => Array.from(images.value.keys()));

  const layerOptions = computed(() =>
    allLayers.value
      .filter((l) => l.mapInfoDto.resolution === selectingResolution.value)
      .map((layer) => ({
        label: layer.mapInfoDto.mapName,
        value: layer.mapId,
      })),
  );

  const getLayers = (resolution: string) => {
    return allLayers.value.filter((e) => e.mapInfoDto.resolution === resolution);
  };
  const setSelectingResolution = (newValue: string) => {
    selectingResolution.value = newValue;
  };
  const setSelectingAIFunction = (newValue: string) => {
    selectingAIFunction.value = newValue;
  };

  const layersByResolution = computed(() =>
    allLayers.value.filter((l) => l.mapInfoDto.resolution === selectingResolution.value),
  );

  const periodOptions = computed(
    () =>
      layersByResolution.value.map((obj) => {
        return { id: obj.mapInfoDto.resolution, period_photo: obj.mapInfoDto.mapName };
      }) || [],
  );

  function showLayersDisplayed(item: LayerResType) {
    layersDisplayed.value = layersDisplayed.value.concat([item]);
  }

  function removeLayerDisplayed(item: LayerResType) {
    layersDisplayed.value = layersDisplayed.value.filter((i) => i.mapId !== item.mapId);
  }

  function removeAllLayerDisplayed() {
    layersDisplayed.value = [];
  }

  function addImage(imageOverlay: Entity, imageId: string) {
    images.value.set(imageId, imageOverlay);
  }

  function removeImage(imageId: string) {
    images.value.delete(imageId);
  }

  function removeAllImages() {
    images.value.forEach((img, key) => {
      removeImage(key);
    });
    images.value.clear();
  }

  return {
    selectingResolution,
    setSelectingResolution,
    setSelectingAIFunction,
    selectingAIFunction,
    allLayers,
    periodOptions,
    getLayers,
    layerFirstId,
    layerSecondId,
    layersByResolution,
    baseLayers,
    layers,

    isShowLayersDisplayed,
    showLayersDisplayed,
    removeAllLayerDisplayed,
    layersDisplayed,
    removeLayerDisplayed,
    addImage,
    removeImage,
    removeAllImages,
    images,
    imageIds,
    resolutionOptions,
    layerOptions,
    baseLayerInfo,
  };
});
