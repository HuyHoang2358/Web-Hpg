<template>
  <div class="selection-container z-50 left-3 absolute">
    <FieldSelection />
  </div>

  <div
    :class="[
      'flex flex-row absolute z-50 tool-container',
      current ? 'left-3 move-animation' : 'left-7',
    ]"
  >
    <div class="w-10">
      <div class="flex flex-col items-center w-10 bg-[#151515] bg-opacity-90 rounded-sm">
        <ButtonTool
          :title="t('home.mapTool.layerMap')"
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.LAYER"
          :disabled="mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE"
        >
          <IconLayerActive v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.LAYER" />
          <IconLayerInactive v-else />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :title="t('home.mapTool.savedAddress')"
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.BOOKMARK"
          disabled
        >
          <IconBookmarkActive v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.BOOKMARK" />
          <IconBookmark v-else />
        </ButtonTool>
      </div>

      <div class="flex flex-col items-center w-10 bg-[#151515] bg-opacity-90 rounded-sm mt-2">
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.CARING_AREA"
          :on-click="onClickIcon"
          :title="t('home.mapTool.caringArea')"
          disabled
        >
          <IconCaringArea
            :class="[
              mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.CARING_AREA
                ? 'text-[#EE0033]'
                : 'text-[#D9D9D9] group-hover:text-[#EE0033]',
            ]"
          />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.POLYGON"
          :on-click="onClickIcon"
          title="Polygon tool"
          disabled
        >
          <!--          :disabled="
            mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE ||
            mapToolStore.activeFunction === ACTIVE_FUNCTION.SEARCH_IMAGES ||
            mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_OBJECT
          "-->
          <IconPolygonActive v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.POLYGON" />
          <IconPolygonToolMap v-else />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.UPLOAD"
          title="Upload"
          disabled
        >
          <IconUploadActive v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.UPLOAD" />
          <IconUpload v-else />
        </ButtonTool>
      </div>

      <div class="flex flex-col items-center w-10 bg-[#151515] bg-opacity-90 rounded-sm mt-2">
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.SEARCH"
          :on-click="onClickIcon"
          title="Searching"
          disabled
        >
          <IconSearch
            :class="[
              mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.SEARCH
                ? 'text-[#EE0033]'
                : 'text-[#D9D9D9] group-hover:text-[#EE0033]',
            ]"
          />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.ZOOM_IN"
          title="Zoom in"
        >
          <IconZoomIn class="text-[#D9D9D9] group-hover:text-[#EE0033]" />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.ZOOM_OUT"
          title="Zoom Out"
        >
          <IconZoomOut class="text-[#D9D9D9] group-hover:text-[#EE0033]" />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :on-click="onClickIcon"
          :name="ICON_TOOL_ACTIVE.PRINTING"
          title="Printing Map"
        >
          <IconPrinting class="text-[#D9D9D9] group-hover:text-[#EE0033]" />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.FULL_SCREEN"
          :on-click="onClickIcon"
          title="Full Screen"
        >
          <IconFullScreen
            :class="[
              mapToolStore.isFullscreenModel
                ? 'text-[#EE0033]'
                : 'text-[#D9D9D9] group-hover:text-[#EE0033]',
            ]"
          />
        </ButtonTool>
      </div>
      <div class="flex flex-col items-center w-10 bg-[#151515] rounded-sm bg-opacity-90 mt-2">
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.MEASURING_HORIZONTAL"
          :on-click="onClickIcon"
          :title="t('home.mapTool.measureLength')"
          disabled
        >
          <IconMeasuringHorizontalActive
            v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.MEASURING_HORIZONTAL"
          />
          <IconMeasuringHorizontal v-else />
        </ButtonTool>
        <a-divider class="h-px m-0 bg-[#333333]" />
        <ButtonTool
          :name="ICON_TOOL_ACTIVE.RULER"
          :on-click="onClickIcon"
          :title="t('home.mapTool.measureArea')"
          disabled
        >
          <IconRulerActive v-if="mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.RULER" />
          <IconRuler v-else />
        </ButtonTool>
      </div>
    </div>
    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import IconPrinting from '@/components/icons/tools/IconPrinting.vue';
import IconZoomIn from '@/components/icons/tools/IconZoomIn.vue';
import IconZoomOut from '@/components/icons/tools/IconZoomOut.vue';
import IconFullScreen from '@/components/icons/tools/IconFullScreen.vue';
import IconRuler from '@/components/icons/tools/IconRuler.vue';
import ButtonTool from '@/components/home/ButtonTool.vue';
import LayerMapSection from '@/components/home/sections/LayerMapSection.vue';
import { ACTIVE_FUNCTION, ICON_TOOL_ACTIVE } from '@/utils/enums';
import IconLayerActive from '@/components/icons/tools/IconLayerActive.vue';
import IconLayerInactive from '@/components/icons/tools/IconLayerInactive.vue';
import IconMeasuringHorizontal from '@/components/icons/tools/IconMeasuringHorizontal.vue';
import IconUpload from '@/components/icons/tools/IconUpload.vue';
import IconPolygonActive from '@/components/icons/tools/IconPolygonActive.vue';
import { useMapToolStore } from '@/stores/mapTool';
import IconMeasuringHorizontalActive from '@/components/icons/tools/IconMeasuringHorizontalActive.vue';
import IconRulerActive from '@/components/icons/tools/IconRulerActive.vue';
import IconUploadActive from '@/components/icons/tools/IconUploadActive.vue';
import UploadSection from '@/components/home/sections/UploadSection.vue';
import BookmarkSection from '@/components/home/sections/BookmarkSection.vue';
import IconCaringArea from '@/components/icons/tools/IconCaringArea.vue';
import CaringAreaSection from '@/components/home/sections/CaringAreaSection.vue';
import IconPolygonToolMap from '@/components/icons/tools/IconPolygonToolMap.vue';
import { computed, shallowRef, watch } from 'vue';
import SearchSection from '@/components/home/sections/SearchSection.vue';
import { useMapStore } from '@/stores/map';
import { notification } from 'ant-design-vue';
import IconBookmarkActive from '@/components/icons/tools/IconBookmarkActive.vue';
import IconBookmark from '@/components/icons/tools/IconBookmark.vue';
import IconSearch from '@/components/icons/tools/IconSearch.vue';
import FieldSelection from '@/components/home/sections/FieldSelection.vue';
import { changeSceneMode } from '@/DTP_new/modules/map';
import { CESIUM_SCENE_MODES } from '@/DTP_new/configs/globalVariables';
import { zoomInMap, zoomOutMap } from '@/DTP_new/modules/camera';
import { turnOffFullscreenMode, turnOnFullscreenMode } from '@/DTP_new/modules/mapTool';
import { drawPolygonHandle } from '@/DTP_new/modules/handles/drawPolygonHandle';
import { useI18n } from 'vue-i18n';
import ChangeDetectionInfoSection from '@/components/home/sections/ChangeDetectionInfoSection.vue';

const mapToolStore = useMapToolStore();
const mapStore = useMapStore();
const { t } = useI18n();
const current = shallowRef();

watch(
  () => mapToolStore.iconToolActive,
  () => {
    switch (mapToolStore.iconToolActive) {
      case ICON_TOOL_ACTIVE.CHANGE_DETECTION_INFO:
        current.value = ChangeDetectionInfoSection;
        break;
      case ICON_TOOL_ACTIVE.LAYER:
        current.value = LayerMapSection;
        break;
      case ICON_TOOL_ACTIVE.CARING_AREA:
        current.value = CaringAreaSection;
        break;
      case ICON_TOOL_ACTIVE.BOOKMARK:
        current.value = BookmarkSection;
        break;
      case ICON_TOOL_ACTIVE.UPLOAD:
        current.value = UploadSection;
        break;
      case ICON_TOOL_ACTIVE.SEARCH:
        current.value = SearchSection;
        break;
      default:
        current.value = undefined;
    }
  },
);

// const { turnOnDrawPolygon } = useDrawPolygon();
// const { turnOnMeasurePolyline } = useMeasurePolyline();

const checkToolDraw = computed(
  () =>
    mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.POLYGON ||
    mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.MEASURING_HORIZONTAL ||
    mapToolStore.iconToolActive === ICON_TOOL_ACTIVE.RULER,
);

const onClickIcon = (name: ICON_TOOL_ACTIVE) => {
  if (checkToolDraw.value) {
    return;
  }

  if (mapStore.isShowRegionChart && name === ICON_TOOL_ACTIVE.POLYGON) {
    notification.warning({
      message: 'Thông báo',
      description: 'Vui lòng xóa vùng quan tâm hiện tại và thử lại!',
    });
    return;
  }

  mapToolStore.changeActiveTool(name);
  switch (name) {
    case ICON_TOOL_ACTIVE.LAYER:
      break;
    case ICON_TOOL_ACTIVE.BOOKMARK:
      break;
    case ICON_TOOL_ACTIVE.PRINTING:
      // FIXME: printing function is not working
      //captureScreenshot();
      break;
    case ICON_TOOL_ACTIVE.ZOOM_IN:
      zoomInMap();
      break;
    case ICON_TOOL_ACTIVE.ZOOM_OUT:
      zoomOutMap();
      break;
    case ICON_TOOL_ACTIVE.SEARCH:
      break;
    case ICON_TOOL_ACTIVE.FULL_SCREEN:
      if (mapToolStore.isFullscreenModel) {
        turnOffFullscreenMode();
      } else {
        turnOnFullscreenMode();
      }
      break;
    case ICON_TOOL_ACTIVE.POLYGON:
      // turn on mode draw polygon
      drawPolygonHandle();
      break;
    case ICON_TOOL_ACTIVE.CARING_AREA:
      break;
    case ICON_TOOL_ACTIVE.MEASURING_HORIZONTAL:
      // turnOnMeasurePolyline();
      break;
    case ICON_TOOL_ACTIVE.RULER:
      // turnOnDrawPolygon(DRAW_TYPE.MEASURE_POLYGON);
      break;
    case ICON_TOOL_ACTIVE.UPLOAD:
      break;
    case ICON_TOOL_ACTIVE.SCENE2D:
      changeSceneMode(CESIUM_SCENE_MODES[0]);
      break;
    case ICON_TOOL_ACTIVE.SCENE3D:
      changeSceneMode(CESIUM_SCENE_MODES[1]);
      break;
    default:
      break;
  }
};
</script>

<style scoped>
.selection-container {
  top: 66px;
}

.tool-container {
  top: 145px;
}

@keyframes moveLeft {
  from {
    left: 28px;
  }
  to {
    left: 16px;
  }
}

.move-animation {
  animation: moveLeft 0.2s ease-in-out;
}
</style>
