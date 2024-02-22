<template>
  <div class="flex flex-row">
    <div
      class="flex flex-col bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90 container-section"
    >
      <HeaderSection
        :on-close="() => mapToolStore.changeActiveTool()"
        :title="t('home.mapTool.layerMapInField')"
        is-not-show-divider
      />

      <div class="mx-4">
        <a-input
          :placeholder="t('search')"
          class="bg-[#353535]"
          v-model:value="searchValue"
        >
          <template #prefix>
            <IconSearchInput />
          </template>
        </a-input>
      </div>

      <div
        class="flex flex-1 overflow-auto mr-2"
        v-if="data.length > 0"
      >
        <ul class="w-full p-0 list-none">
          <li
            :class="['flex flex-col pl-4 pt-2 group', item.mapId === activeId && 'bg-[#333333]']"
            v-for="(item, index) in data"
            :key="index"
          >
            <div class="flex flex-row">
              <div class="img-size">
                <img
                  :src="item?.mapInfoDto.thumbnailPath"
                  alt="layer-map"
                  class="border border-solid border-[#6D6D6D] rounded-sm cursor-pointer img-size"
                  @click="
                    layersStore.layersDisplayed.find((i) => i.mapId === item.mapId)
                      ? removeLayerFromMap(item)
                      : addLayerToMap(item)
                  "
                />
              </div>

              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-col pl-3.5">
                  <div
                    @click="onClickItem(item.mapId)"
                    class="cursor-pointer"
                  >
                    <IconPublic />
                    <label
                      :class="[
                        'text-sm text-[#C0C0C0] font-medium ml-1 cursor-pointer',
                        item.mapId === activeId ? 'text-main' : 'group-hover:text-white',
                      ]"
                    >
                      {{ item?.mapInfoDto.mapName }}
                    </label>
                  </div>
                  <a-typography-text class="text-[#C0C0C0] text-xs mt-0.5 text-date font-normal">
                    {{ t('resolution') }}: {{ item?.mapInfoDto.resolution }}
                  </a-typography-text>
                  <div>
                    <a-button
                      v-if="layersStore.layersDisplayed.find((i) => i.mapId === item.mapId)"
                      type="primary"
                      class="border border-[#6F6B6B] text-[#979797] text-[10px] px-1 py-0 h-5 bg-transparent mt-2 rounded-sm"
                      @click="removeLayerFromMap(item)"
                    >
                      <IconRemoveLayer class="mr-1" />
                      {{ t('remove') }}
                    </a-button>
                    <a-button
                      v-else
                      type="primary"
                      class="border border-[#6F6B6B] text-[#979797] text-[10px] px-1 py-0 h-5 bg-transparent mt-2 rounded-sm"
                      @click="addLayerToMap(item)"
                    >
                      <IconAddLayerSmall class="mr-1" />
                      {{ t('display') }}
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-px w-full bg-[#373737] mt-3" />
          </li>
        </ul>
      </div>

      <CustomASpin :spinning="isLoading && data.length === 0" />

      <CustomAEmpty v-if="!isLoading && data?.length === 0" />
    </div>
    <DetailLayerSection
      v-if="showDetail"
      :close-detail="closeDetail"
      :detail-layer="dataDetail"
    />
  </div>
  <ModalHandleLayer
    :open="showModalHandleLayer"
    :close="closeModalHandleLayer"
    :layer-detail="layerDetail"
  />
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import IconAddLayerSmall from '@/components/icons/IconAddLayerSmall.vue';
import DetailLayerSection from '@/components/home/sections/DetailLayerSection.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { useLayerDetail, useMapsByUnit } from '@/services/hooks/useLayer';
import type { ComputedRef } from 'vue';
import type { LayerDetailResType } from '@/services/apis/layer';
import IconPublic from '@/components/icons/home/IconPublic.vue';
import IconRemoveLayer from '@/components/icons/home/IconRemoveLayer.vue';
import { removeLayer } from '@/DTP/mapTool/layers';
import { notification } from 'ant-design-vue';
import ModalHandleLayer from '@/components/home/modals/ModalHandleLayer.vue';
import HeaderSection from '@/components/home/sections/HeaderSection.vue';
import { keyNotificationMap } from '@/utils/constants';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import CustomASpin from '@/components/home/CustomASpin.vue';
import type { LayerResType } from '@/DTP/DTP.type';
import { useLayersStore } from '@/stores/layers';
import { useMapToolStore } from '@/stores/mapTool';
import { createImageLayersFromMap } from '@/DTP/common';
import { useI18n } from 'vue-i18n';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import { addImageryLayer, removeImageryLayer } from '@/DTP_new/modules/imageryLayer';

const layersStore = useLayersStore();
const mapToolStore = useMapToolStore();

const { t } = useI18n();
const activeIndexTab = ref<string>('');
const activeId = ref<string>('');
const searchValue = ref<string>('');
const layerDetail = ref<LayerDetailResType>();

const layerDetailEnable: ComputedRef<boolean> = computed(() => !!activeId.value);
const indexTabEnable: ComputedRef<boolean> = computed(() => !!activeIndexTab.value);

onMounted(() => {
  activeIndexTab.value = mapToolStore.selectedUnit;
});

watch(
  () => mapToolStore.selectedUnit,
  () => {
    activeIndexTab.value = mapToolStore.selectedUnit;
  },
);

const {
  data: layers,
  refetch,
  isLoading,
} = useMapsByUnit({ unitId: activeIndexTab }, indexTabEnable);

const { data: layerDetailData, refetch: layerDetailRefetch } = useLayerDetail(
  activeId,
  layerDetailEnable,
);

const dataDetail: ComputedRef = computed(() => {
  return {
    title: layerDetailData?.value?.data?.name || '',
    description: layerDetailData?.value?.data?.description || '',
    time_create_layer: layerDetailData?.value?.data?.time_create_layer || '',
    sharing: layerDetailData?.value?.data?.sharing || '',
    layer_provider: layerDetailData?.value?.data?.layer_provider || '',
  };
});

const data: ComputedRef<LayerResType[]> = computed(() => {
  return (
    layers?.value?.data?.filter((item) =>
      item.mapInfoDto.mapName?.toUpperCase()?.includes(searchValue.value?.toUpperCase()),
    ) || []
  );
});

const showModalHandleLayer = ref(false);

const showDetail = ref(false);

const closeDetail = () => {
  showDetail.value = false;
  activeId.value = '';
};

const closeModalHandleLayer = () => {
  showModalHandleLayer.value = false;
  layerDetail.value = undefined;
};

const onClickItem = (id: string) => {
  showDetail.value = true;
  activeId.value = id;
};

watch(activeId, () => {
  if (activeId.value) layerDetailRefetch();
});

watch(activeIndexTab, () => {
  refetch();
  searchValue.value = '';
});

// TODO: Add layer to viewer
const addLayerToMap = (layer: LayerResType) => {
  layersStore.showLayersDisplayed(layer);
  notification.close(keyNotificationMap);

  // reFormat layer info to imageryLayerInfo to add into viewer
  const newFormatMap = reFormatMapInfo(layer);
  // Change base map in viewer
  addImageryLayer(newFormatMap);
};

// TODO: remove layer out of viewer
const removeLayerFromMap = async (layer: LayerResType) => {
  removeImageryLayer(layer.mapId);
  layersStore.removeLayerDisplayed(layer);
};
</script>

<style scoped>
img {
  border-radius: 1px;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

img:hover {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.img-size {
  width: 78px;
  height: 59px;
}
</style>
