<template>
  <div class="flex gap-x-3 mb-1">
    <div
      :class="[
        'bg-opacity-90 rounded-sm font-medium px-3 py-1 cursor-pointer uppercase',
        mapToolStore.activeFunction === ACTIVE_FUNCTION.DEFAULT
          ? 'text-white bg-main'
          : 'text-[#B6B6B6] bg-[#151515]',
      ]"
      @click="onGoHome"
    >
      {{ t('home.bottom.home') }}
    </div>
    <div
      :class="[
        'bg-opacity-90 rounded-sm font-medium px-3 py-1',
        mapToolStore.activeFunction === ACTIVE_FUNCTION.SEARCH_IMAGES
          ? 'text-white bg-main'
          : 'text-[#B6B6B6] bg-[#151515]',
      ]"
      disabled
    >
      {{ t('home.bottom.searchImages') }}
    </div>
    <div
      :class="[
        'bg-opacity-90 rounded-sm font-medium px-3 py-1 cursor-pointer',
        mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE
          ? 'text-white bg-main'
          : 'text-[#B6B6B6] bg-[#151515]',
      ]"
      @click="onClickDetectChange"
    >
      {{ t('home.bottom.detectChange') }}
    </div>
    <div
      :class="[
        'bg-opacity-90 rounded-sm font-medium px-3 py-1 cursor-pointer',
        mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_OBJECT
          ? 'text-white bg-main'
          : 'text-[#B6B6B6] bg-[#151515]',
      ]"
      @click="onClickDetectObject"
    >
      {{ t('home.bottom.detectObject') }}
    </div>
    <div
      :class="[
        'bg-opacity-90 rounded-sm font-medium px-3 py-1',
        mapToolStore.activeFunction === ACTIVE_FUNCTION.MONITOR_CURRENT_STATUS
          ? 'text-white bg-main'
          : 'text-[#B6B6B6] bg-[#151515]',
      ]"
      disabled
    >
      {{ t('home.bottom.monitorCurrentStatus') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMapToolStore } from '@/stores/mapTool';
import { ACTIVE_FUNCTION } from '@/utils/enums';
import { notification } from 'ant-design-vue';
import { keyNotificationMap } from '@/utils/constants';
import { useQueryClient } from '@tanstack/vue-query';
import { IMAGES_IN_LAYER_QUERY_KEY } from '@/services/hooks/useLayer';
import { useViewerStore } from '@/stores/viewer';
import { changeBaseLayer } from '@/DTP/mapTool/layers';
import { useLayersStore } from '@/stores/layers';
import { useI18n } from 'vue-i18n';
import { useCompareMapStore } from '@/stores/compareMapStore';
import {
  addImageryLayer,
  removeALlImageryLayer,
  removeAllShowingLayers,
  removeBillboards,
} from '@/DTP_new/modules/imageryLayer';
import { clearDrawStore } from '@/DTP_new/modules/handles/drawPolygonHandle';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import { useLayerStore } from '@/stores/LayerStore';
import { defaultHandle } from '@/DTP_new/modules/handles/handle';

const mapToolStore = useMapToolStore();

const layersStore = useLayersStore();

// TODO: Define store
const compareMapStore = useCompareMapStore();
const layerStore = useLayerStore();
const queryClient = useQueryClient();
const { t } = useI18n();

const resetState = () => {
  compareMapStore.isShowOpacity = false;
  if (mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE) {
    if (compareMapStore.isShowImageryLayersSplit) {
      // remove imageryLayers
      removeALlImageryLayer();

      // Remove polygon if have
      clearDrawStore();

      // add first basemap
      layerStore.baseMapId = '';
      const layer = layerStore.layers[0];
      const newFormatMap = reFormatMapInfo(layer);

      // Change base map in viewer
      addImageryLayer(newFormatMap, 0);
      if (layersStore.baseLayerInfo) {
        changeBaseLayer(layersStore.baseLayerInfo);
      }
      compareMapStore.isShowImageryLayersSplit = false;
    }

    compareMapStore.isShowDetectChangeQuery = false;
  } else if (mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_OBJECT) {
    mapToolStore.isShowDetectObjectQuery = false;
    mapToolStore.isShowAIDetectObjectResult = false;
    removeAllShowingLayers();
    removeBillboards();
  }

  mapToolStore.changeActiveTool();
  defaultHandle();
};

const onGoHome = () => {
  resetState();
  mapToolStore.activeFunction = ACTIVE_FUNCTION.DEFAULT;
};

const onSearchImages = () => {
  resetState();
  queryClient.invalidateQueries({ queryKey: [IMAGES_IN_LAYER_QUERY_KEY] });
  mapToolStore.activeFunction = ACTIVE_FUNCTION.SEARCH_IMAGES;
};

const onClickDetectChange = () => {
  resetState();
  notification.close(keyNotificationMap);
  mapToolStore.activeFunction = ACTIVE_FUNCTION.DETECT_CHANGE;
  compareMapStore.isShowDetectChangeQuery = true;
};

const onClickDetectObject = () => {
  resetState();
  notification.close(keyNotificationMap);
  mapToolStore.activeFunction = ACTIVE_FUNCTION.DETECT_OBJECT;
  mapToolStore.isShowDetectObjectQuery = true;
};
</script>
