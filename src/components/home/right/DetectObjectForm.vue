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
              {{ t('resolution') }}
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
              {{ t('time') }}
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="mapId"
              class="mb-3 h-6"
            >
              <a-select
                v-model:value="formState.mapId"
                :options="layerStore.layerPeriodOptions"
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
            html-type="submit"
            size="small"
            @click="onSubmit"
            :loading="isPendingDetectObjectMapData || isPendingDetectObjectStatistic"
          >
            {{ t('home.bottom.aiResult') }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { useMapToolStore } from '@/stores/mapTool';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import {
  useDetectObjectMapData,
  useDetectObjectStatistic,
  useMapsByUnit,
} from '@/services/hooks/useLayer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useLayerStore } from '@/stores/LayerStore';
import {
  addImageryLayer,
  removeALl1ImageryLayer,
  removeAllShowingLayers,
  removeBillboards,
} from '@/DTP_new/modules/imageryLayer';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import { useI18n } from 'vue-i18n';
import { clickGetFeatureHandle } from '@/DTP_new/modules/handles/clickGetFeatureHandle';
import { Cartesian2, Cartesian3, Entity } from 'cesium';
import { ICON_WARNING_URL } from '@/DTP/config';
import { objectsExample } from '@/utils/constants';
import { useGlobalStore } from '@/stores/globalStore';
import { useCompareMapStore } from '@/stores/compareMapStore';

const mapToolStore = useMapToolStore();
const layerStore = useLayerStore();
const { t } = useI18n();
const formRef = ref<FormInstance>();

interface FormState {
  resolution?: string;
  mapId?: string;
  region?: string;
  layerId?: string;
  objectType?: string;
}

const formState = reactive<FormState>({});
const globalStore = useGlobalStore();

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

onMounted(() => {
  if (layerStore.resolutionOptions.length > 0) {
    formState.resolution = layerStore.resolutionOptions[0].value;
    layerStore.setSelectingResolution(layerStore.resolutionOptions[0].value);
  }

  if (layerStore?.layerPeriodOptions.length >= 1) {
    formState.mapId = layerStore?.layerPeriodOptions[0].value;
  }
});

watch(
  () => formState.resolution,
  () => {
    if (formState.resolution) {
      layerStore.selectingResolution = formState.resolution;
    }

    if (layerStore?.layerPeriodOptions.length >= 1) {
      formState.mapId = layerStore?.layerPeriodOptions[0].value;
    }
  },
);

watch(layerOptions, () => {
  formState.layerId = layerOptions.value[0].value;
});

watch(formState, () => {
  mapToolStore.isShowButtonAIDetectChange = false;
});

const { mutate: fetchDetectObjectMapData, isPending: isPendingDetectObjectMapData } =
  useDetectObjectMapData();
const { mutate: fetchDetectObjectStatistic, isPending: isPendingDetectObjectStatistic } =
  useDetectObjectStatistic();

const { onError } = useErrorHandler();
const compareMapStore = useCompareMapStore();
const onSubmit = () => {
  formRef.value?.validate().then(() => {
    if (!formState.mapId) {
      return;
    }

    compareMapStore.isShowOpacity = true;
    //removeAllShowingLayers();
    removeALl1ImageryLayer();
    removeBillboards();
    fetchDetectObjectMapData(
      {
        satelliteImageId: formState.mapId,
      },
      {
        onError,
        onSuccess(data) {
          //addImageryLayer(reFormatMapInfo(data.data));

          const objectDetectionMap = data.data;
          const reFormatMap = reFormatMapInfo(objectDetectionMap, true);

          addImageryLayer(reFormatMap);

          // save map info into store
          layerStore.getFeatureLayerInfo = objectDetectionMap;
          layerStore.typeGetFeatureInfo = 'object-detection';

          objectsExample.forEach((changePoint) => {
            const position = Cartesian3.fromDegrees(
              Number(changePoint.longitude),
              Number(changePoint.latitude),
            );

            const iconSize = new Cartesian2(18.61, 24);

            const billboard = globalStore.viewer?.entities.add({
              position: position,
              billboard: {
                image: ICON_WARNING_URL,
                width: iconSize.x,
                height: iconSize.y,
                show: globalStore.isBlinking,
              },
            });

            globalStore.billboards.push({
              entity: billboard as Entity,
            });
          });

          globalStore.intervalBlink = setInterval(() => {
            globalStore.toggleBlinking();
            globalStore.billboards.forEach((b) => {
              globalStore.updateBillboardVisibility(b);
            });
          }, 700); // Change the duration as needed*!/

          // turn on handle click
          clickGetFeatureHandle();
        },
      },
    );
    fetchDetectObjectStatistic(
      {
        satelliteImageId: formState.mapId,
        layerId: formState.layerId ? 'hthp2020' : undefined,
      },
      {
        onError,
        onSuccess(data) {
          mapToolStore.isShowAIDetectObjectResult = true;
          mapToolStore.detectObjectStatisticData = data.data;

          if (formState.layerId) {
            const selectedLayer = layers?.value?.data?.find(
              (item) => item.mapId === formState.layerId,
            );

            if (selectedLayer) {
              addImageryLayer(reFormatMapInfo(selectedLayer));
            }
          }
        },
      },
    );
  });
};
</script>
