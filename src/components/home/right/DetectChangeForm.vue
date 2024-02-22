<template>
  <div class="flex flex-1 flex-col px-3 relative">
    <a-form
      ref="formRef"
      :model="formState"
      layout="horizontal"
      class="w-full flex-1 mt-3 flex flex-col justify-between"
    >
      <div>
        <a-row>
          <a-col
            span="10"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Resolution
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="resolution"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.resolution"
                :options="layerStore.resolutionOptions"
                size="small"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col
            span="10"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              {{ t('home.startDate') }}
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="layerFirstId"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.layerFirstId"
                :options="
                  layerStore.layerPeriodOptions.filter(
                    (item) => item.value !== formState.layerSecondId,
                  )
                "
                size="small"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col
            span="10"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              {{ t('home.endDate') }}
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="layerSecondId"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.layerSecondId"
                :options="
                  layerStore.layerPeriodOptions.filter(
                    (item) => item.value !== formState.layerFirstId,
                  )
                "
                size="small"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="mapToolStore.isShowButtonAIDetectChange">
          <a-col
            span="10"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Khu vực
            </label>
          </a-col>
          <a-col span="11">
            <a-form-item
              name="region"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.region"
                :options="areaOptions"
                :allow-clear="true"
                :loading="isLoadingCaring"
                size="small"
                placeholder="Chọn"
                show-search
                :filter-option="filterOption"
              />
            </a-form-item>
          </a-col>
          <a-col
            span="3"
            class="flex flex-col items-end"
          >
            <a-tooltip placement="right">
              <template #title>
                <span>Vẽ polygon</span>
              </template>
              <a-button
                type="ghost"
                size="small"
                class="w-7 h-8 m-0 mt-1 p-0 bg-[#2E2E2E] justify-center items-center flex group"
                @click="onDrawPolygon"
              >
                <IconPolygonSingle
                  :class="[
                    'group-hover:text-main',
                    entityStore.isDrawPolygon ? 'text-main' : 'text-[#D9D9D9]',
                  ]"
                />
              </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row v-if="compareMapStore.isShowButtonAIDetectChange">
          <a-col
            span="10"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Reference Layer
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="layerId"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.layerId"
                :options="layerOptions"
                size="small"
                :loading="isLoadingLayers"
                :allow-clear="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-form-item class="h-6">
        <div class="flex flex-row justify-end gap-x-6">
          <a-button
            type="primary"
            size="small"
            @click="onShowAIResult"
            :loading="isPendingFetchAIDetectChangeReport"
            v-if="compareMapStore.isShowButtonAIDetectChange"
          >
            Show AI result
          </a-button>
          <a-button
            type="primary"
            html-type="button"
            size="small"
            @click="compare"
            v-else
          >
            Compare
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { useMapToolStore } from '@/stores/mapTool';
import IconPolygonSingle from '@/components/icons/home/IconPolygonSingle.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useLayersStore } from '@/stores/layers';
import { useMapsByUnit } from '@/services/hooks/useLayer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useConfigStore } from '@/stores/config';
import { useAIDetectChangeReport } from '@/services/hooks/useReport';
import { useCaring } from '@/services/hooks/useBookmark';
import { convertBoundaryToRegionBody, filterOption } from '@/DTP/common';
import { useDrawPolygon } from '@/DTP/mapTool/polygon';
import { useEntityStore } from '@/stores/entity';
import { createPolygonByCaringInfo, removeCurrentPolygon } from '@/DTP/entity';

import { useLayerStore } from '@/stores/LayerStore';
import { useCompareMapStore } from '@/stores/compareMapStore';
import { useGlobalStore } from '@/stores/globalStore';
import { initImageryLayersSplit } from '@/DTP_new/modules/compareMap';
import { useAIChangeDetectionResult } from '@/services/hooks/useMap';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import {
  addImageryLayer,
  createImageryLayer,
  removeALl2ImageryLayer,
  removeALlImageryLayer,
} from '@/DTP_new/modules/imageryLayer';
import { clickGetFeatureHandle } from '@/DTP_new/modules/handles/clickGetFeatureHandle';
import { useI18n } from 'vue-i18n';

const mapToolStore = useMapToolStore();
const layersStore = useLayersStore();
const { t } = useI18n();
const entityStore = useEntityStore();

// TODO: Define store
const globalStore = useGlobalStore();
const layerStore = useLayerStore();
const compareMapStore = useCompareMapStore();

const { startDrawingPolygon } = useDrawPolygon();

const onDrawPolygon = () => {
  formState.region = undefined;
  entityStore.isDrawPolygon = true;
  startDrawingPolygon();
};

const formRef = ref<FormInstance>();

interface FormState {
  resolution?: string;
  layerFirstId?: string;
  layerSecondId?: string;
  region?: string;
  layerId?: string;
}

const formState = reactive<FormState>({});

const region = ref('');

watch(
  () => formState.region,
  () => {
    entityStore.isDrawPolygon = false;
    if (entityStore.polygon) {
      removeCurrentPolygon();
    }
  },
);

// TODO: Set Default value for FormState
onMounted(() => {
  if (layerStore.resolutionOptions.length > 0) {
    formState.resolution = layerStore.resolutionOptions[0].value;
    layerStore.setSelectingResolution(layerStore.resolutionOptions[0].value);
  }

  if (layerStore?.layerPeriodOptions.length >= 2) {
    formState.layerFirstId = layerStore?.layerPeriodOptions[1].value;
    formState.layerSecondId = layerStore?.layerPeriodOptions[0].value;
  }
});

const { data: areas, isLoading: isLoadingCaring } = useCaring();

const caringOptions = computed(
  () =>
    areas?.value?.data?.map((item) => ({
      label: item.name,
      value: item.id,
      ...item,
    })) || [],
);

const areaOptions = computed(() => [
  {
    label: 'Khu vực quan tâm',
    options: caringOptions.value,
  },
]);

const activeIndexTab = ref<string>(mapToolStore.selectedUnit);

const {
  data: layers,
  isLoading: isLoadingLayers,
  refetch,
} = useMapsByUnit(
  { unitId: activeIndexTab },
  computed(() => Boolean(activeIndexTab.value)),
);

watch(
  () => mapToolStore.selectedUnit,
  () => {
    activeIndexTab.value = mapToolStore.selectedUnit;
    refetch();
  },
);

const layerOptions = computed(() => {
  return (
    layers?.value?.data.map((layer) => ({ label: layer.mapInfoDto.mapName, value: layer.mapId })) ||
    []
  );
});

const { handleMessageError } = useErrorHandler();

watch(
  () => formState.resolution,
  () => {
    if (formState.resolution) {
      layersStore.selectingResolution = formState.resolution;
    }

    if (layersStore.layerOptions.length >= 2) {
      formState.layerFirstId = layersStore?.layerOptions[1].value;
      formState.layerSecondId = layersStore?.layerOptions[0].value;
    }
  },
);

// TODO: Reset state
const resetState = () => {
  compareMapStore.isShowButtonAIDetectChange = false;
  formState.region = undefined;
  formState.layerId = undefined;
};

// Watch resolution
watch(
  () => formState.resolution,
  () => {
    resetState();
  },
);

// Watch layerFirstId
watch(
  () => formState.layerFirstId,
  () => {
    resetState();
  },
);

// Watch layerSecondId
watch(
  () => formState.layerSecondId,
  () => {
    resetState();
  },
);

// TODO: Compare 2 map
const compare = () => {
  formRef.value?.validate().then(() => {
    if (!formState.layerFirstId || !formState.layerSecondId) {
      return;
    }
    const mapBefore = layerStore.getLayerInfoById(formState.layerFirstId);
    const mapAfter = layerStore.getLayerInfoById(formState.layerSecondId);
    if (!mapBefore || !mapAfter) return;
    // console.log('mapBefore:', mapBefore);
    // console.log('mapAfter:', mapAfter);
    compareMapStore.mapBeforeId = formState.layerFirstId;
    compareMapStore.mapAfterId = formState.layerSecondId;
    compareMapStore.isShowImageryLayersSplit = true;

    setTimeout(() => {
      initImageryLayersSplit(mapBefore, mapAfter);
      compareMapStore.isShowButtonAIDetectChange = true;
      globalStore.viewer?.entities?.removeAll();
    }, 100);

    compareMapStore.isShowOpacity = true;
    formState.layerId = layerOptions.value[0].value;
  });
};

const { mutate: fetchAIDetectChangeReport, isPending: isPendingFetchAIDetectChangeReport } =
  useAIDetectChangeReport();

const { mutate: fetchAIChangeDetectionResult } = useAIChangeDetectionResult();
// TODO: GET AI CHANGE DETECTION
const onShowAIResult = () => {
  //console.log('show AI result');
  if (!compareMapStore.mapAfterId || !compareMapStore.mapBeforeId || !formState.resolution) return;
  // fetch ai result
  // removeALlImageryLayer();
  removeALl2ImageryLayer();
  fetchAIChangeDetectionResult(
    {
      resolution: formState.resolution,
      satelliteImageBeforeId: compareMapStore.mapBeforeId,
      satelliteImageAfterId: compareMapStore.mapAfterId,
    },
    {
      onError: handleMessageError,
      onSuccess(data) {
        const changeDetectionMap = data?.data;
        if (!changeDetectionMap) return;
        const reFormatMap = reFormatMapInfo(changeDetectionMap, true);
        addImageryLayer(reFormatMap);

        // save map info into store
        layerStore.typeGetFeatureInfo = 'change-detection';
        layerStore.getFeatureLayerInfo = changeDetectionMap;

        // turn on handle click
        clickGetFeatureHandle();
      },
    },
  );

  fetchAIDetectChangeReport(
    {
      resolution: formState.resolution,
      satelliteImageBeforeId: compareMapStore.mapBeforeId,
      satelliteImageAfterId: compareMapStore.mapAfterId,
      layerId: formState.layerId
        ? formState.layerId === '7680f960-8f2c-4542-8ce9-a2d12cc6c581'
          ? 'hthp2020'
          : undefined
        : undefined,
    },
    {
      onError: handleMessageError,
      onSuccess(data) {
        //console.log(data);
        compareMapStore.isShowAIDetectChangeResult = true;
        compareMapStore.dataChangeDetectionChart = data?.data || { data: [], labels: [] };

        // mapToolStore.dataDetectChangeChart = data?.data?.rows;
        // mapToolStore.isShowAIDetectChangeResult = true;

        setTimeout(() => {
          if (formState.layerId) {
            const selectedLayer = layers?.value?.data?.find(
              (item) => item.mapId === formState.layerId,
            );

            if (selectedLayer) {
              addImageryLayer(reFormatMapInfo(selectedLayer));
            }
          }

          // if (formState.region) {
          //   const selectedCaring = caringOptions.value.find((item) => item.id === formState.region);
          //   if (selectedCaring) {
          //     region.value = convertBoundaryToRegionBody(selectedCaring.boundary);
          //
          //     createPolygonByCaringInfo(selectedCaring);
          //   }
          // } else if (entityStore.isDrawPolygon) {
          //   region.value = entityStore.regionSearchBody;
          // } else {
          //   removeCurrentPolygon();
          //   region.value = '';
          // }
        }, 100);
      },
    },
  );
};
</script>
