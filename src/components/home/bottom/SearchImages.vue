<template>
  <div class="flex flex-row flex-1">
    <div class="dark-form flex flex-col flex-1 px-3 bg-[#1C1C1C] form-search-images-container">
      <a-typography-text class="my-1 text-xs font-medium">Thông tin tìm kiếm</a-typography-text>
      <a-divider class="m-0 p-0 h-px bg-[#333333]" />

      <a-form
        ref="formRef"
        :model="formState"
        layout="horizontal"
        class="w-full"
      >
        <a-row>
          <a-col
            span="7"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Độ phân giải
            </label>
          </a-col>
          <a-col span="17">
            <a-form-item
              name="resolution"
              class="mb-1 h-6"
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
            span="7"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Thời gian
            </label>
          </a-col>
          <a-col span="17">
            <a-row>
              <a-col span="11">
                <a-form-item
                  name="layerFirstId"
                  class="mb-1 h-6"
                >
                  <a-select
                    v-model:value="formState.layerFirstId"
                    :options="layerStore.layerOptions"
                    size="small"
                  />
                </a-form-item>
              </a-col>
              <a-col
                span="2"
                class="flex justify-center items-center"
              >
                -
              </a-col>
              <a-col span="11">
                <a-form-item
                  name="layerSecondId"
                  class="mb-1 h-6"
                >
                  <a-select
                    v-model:value="formState.layerSecondId"
                    :options="layerStore.layerOptions"
                    size="small"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col
            span="7"
            class="flex items-center"
          >
            <label
              class="text-[#BEBEBE] font-normal text-xs"
              style="font-size: 12px"
            >
              Khu vực
            </label>
          </a-col>
          <a-col span="14">
            <a-form-item
              name="region"
              class="mb-1 h-6"
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
            class="flex flex-col items-end justify-end"
          >
            <a-tooltip placement="right">
              <template #title>
                <span>Vẽ polygon</span>
              </template>
              <a-button
                type="ghost"
                size="small"
                class="w-7 h-6 m-0 p-0 bg-[#2E2E2E] justify-center items-center flex group"
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
        <a-form-item class="m-0 h-6">
          <div class="flex flex-row justify-end gap-x-6">
            <a-button
              type="primary"
              html-type="submit"
              size="small"
              @click="onSubmit"
            >
              Tìm kiếm
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <div class="time-line-container flex flex-col ml-3">
      <Timeline
        title="Kết quả tìm kiếm hình ảnh"
        :images="images"
        :is-loading="isLoading"
        :period="mapToolStore.time1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import IconPolygonSingle from '@/components/icons/home/IconPolygonSingle.vue';
import Timeline from '@/components/home/bottom/Timeline.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useImagesInLayer } from '@/services/hooks/useLayer';
import { useLayersStore } from '@/stores/layers';
import { useCaring } from '@/services/hooks/useBookmark';
import { convertBoundaryToRegionBody, filterOption } from '@/DTP/common';
import { createPolygonByCaringInfo, removeCurrentPolygon } from '@/DTP/entity';
import { useDrawPolygon } from '@/DTP/mapTool/polygon';
import { useEntityStore } from '@/stores/entity';
import { removeAllImages } from '@/DTP/mapTool/layers';

interface FormState {
  resolution?: string;
  layerFirstId?: string;
  layerSecondId?: string;
  region?: string;
}

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

const mapToolStore = useMapToolStore();
const layerStore = useLayersStore();
const entityStore = useEntityStore();

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({});

watch(
  () => formState?.resolution,
  () => {
    // formState?.resolution && layerStore.setSelectingResolution(formState?.resolution);
    //
    // if (layerStore?.layerOptions.length >= 2) {
    //   formState.layerFirstId = layerStore?.layerOptions[0].value;
    //   formState.layerSecondId = layerStore?.layerOptions[0].value;
    // }
  },
);

const period1 = ref('');
const region = ref('');

const { data, isLoading, refetch } = useImagesInLayer({
  layerId: period1,
  region,
});

const images = computed(() => data?.value?.data?.imagePreviewResponseModels);

onMounted(() => {
  console.log('layerStore', toRaw(layerStore.layers));
  // if (layerStore.resolutionOptions.length > 0) {
  //   formState.resolution = layerStore.resolutionOptions[0].value;
  //   layerStore.setSelectingResolution(layerStore.resolutionOptions[0].value);
  // }
  //
  // formState.layerFirstId = layerStore?.layerOptions[0].value;
  // formState.layerSecondId = layerStore?.layerOptions[0].value;
  //
  // period1.value = mapToolStore.periodId1;
  // refetch();
});

watch(
  () => mapToolStore.periodId1,
  () => {
    period1.value = mapToolStore.periodId1;
    refetch();
  },
);

watch(
  () => formState.region,
  () => {
    entityStore.isDrawPolygon = false;
    if (entityStore.polygon) {
      removeCurrentPolygon();
    }
  },
);

const onSubmit = () => {
  formRef.value?.validate().then(() => {
    removeAllImages();

    layerStore.removeAllImages();
    if (formState.region) {
      const selectedCaring = caringOptions.value.find((item) => item.id === formState.region);
      if (selectedCaring) {
        region.value = convertBoundaryToRegionBody(selectedCaring.boundary);

        createPolygonByCaringInfo(selectedCaring);
      }
    } else if (entityStore.isDrawPolygon) {
      region.value = entityStore.regionSearchBody;
    } else {
      removeCurrentPolygon();
      region.value = '';
    }

    refetch();
  });
};

const { startDrawingPolygon } = useDrawPolygon();

const onDrawPolygon = () => {
  formState.region = undefined;
  entityStore.isDrawPolygon = true;
  startDrawingPolygon();
};
</script>

<style scoped>
.form-search-images-container {
  width: 325px;
}

.time-line-container {
  width: calc(100% - (325px));
}
</style>
