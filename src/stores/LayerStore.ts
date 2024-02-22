import { defineStore } from 'pinia';
import type {
  ChangeDetectionInformation,
  ImageryLayerDetail,
  LayerResType,
  OptionType,
} from '@/DTP_new/libs/DTP.type';
import { computed, ref, toRaw, watch } from 'vue';

export const useLayerStore = defineStore('layerStore', () => {
  // state define ------------------------------------------------------------------------------------------------------
  const imageryLayers = ref<Map<string, ImageryLayerDetail>>(new Map());
  const layers = ref<LayerResType[]>([]);
  const resolutionOptions = ref<OptionType[]>([]);
  const selectingResolution = ref<string>('');
  const baseLayerIndex = ref<number>(1);
  const baseMapId = ref<string>('');
  const typeGetFeatureInfo = ref<string>('');
  const getFeatureLayerInfo = ref<LayerResType>();
  const featurePropertiesChangeDetection = ref<ChangeDetectionInformation>();

  // action define -----------------------------------------------------------------------------------------------------
  const layerPeriodOptions = computed(() =>
    layers.value
      .filter((l) => l.mapInfoDto.resolution === selectingResolution.value)
      .map((layer) => ({
        label: layer.mapInfoDto.mapName,
        value: layer.mapId,
      })),
  );
  const setSelectingResolution = (newValue: string) => {
    selectingResolution.value = newValue;
  };

  const allLayerIds = computed(() => {
    return Array.from(imageryLayers.value)
      .filter(([, layerDetail]) => layerDetail.layerIndex >= baseLayerIndex.value)
      .map(([id]) => id);
  });
  const baseLayerIds = computed(() => {
    return Array.from(imageryLayers.value)
      .filter(([, layerDetail]) => layerDetail.isBaseLayer === true)
      .map(([id]) => id);
  });

  const baseLayers = computed(() => {
    return baseLayerIds.value.map((id) => imageryLayers.value.get(id)).filter(Boolean);
  });

  const getLayerInfoById = computed(() => (id: string) => {
    return layers.value.find((layer) => layer.mapId === id);
  });

  const updateLayerIndex = computed(
    () =>
      (startIndex: number, endIndex = -1, type = true, step = 1) => {
        if (endIndex === -1) endIndex = imageryLayers.value.size;
        imageryLayers.value.forEach((layerDetail) => {
          if (layerDetail.layerIndex >= startIndex && layerDetail.layerIndex <= endIndex) {
            if (type) layerDetail.layerIndex += step;
            else layerDetail.layerIndex -= step;
          }
        });
      },
  );

  const isLayerImageryShowing = computed(() => (layerId: string) => {
    return imageryLayers.value.get(layerId)?.isShow ?? false;
  });

  const showingImageryLayers = computed(() =>
    Array.from(imageryLayers.value).filter(([, value]) => {
      return value.isShow && !value.isBaseLayer;
    }),
  );

  return {
    imageryLayers,
    layers,
    typeGetFeatureInfo,
    getFeatureLayerInfo,
    featurePropertiesChangeDetection,
    layerPeriodOptions,
    resolutionOptions,
    setSelectingResolution,
    selectingResolution,
    baseLayerIndex,
    allLayerIds,
    baseLayerIds,
    baseLayers,
    baseMapId,
    getLayerInfoById,
    updateLayerIndex,
    isLayerImageryShowing,
    showingImageryLayers,
  };
});
