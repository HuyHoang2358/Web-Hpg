<template>
  <div
    class="dark-form-transparent height-content-bottom flex flex-col bg-[#151515] bg-opacity-90 rounded-sm container"
  >
    <a-select v-model:value="selectedType">
      <a-select-option value="satellite">{{ t('home.bottom.satelliteBaseMap') }}</a-select-option>
      <a-select-option value="default">{{ t('home.bottom.defaultMap') }}</a-select-option>
      <template #suffixIcon>
        <IconDropdownLarger />
      </template>
    </a-select>

    <div class="h-px bg-[#292929] w-full mt-1" />

    <CustomASpin :spinning="isLoadingDefaultMaps || isLoadingSatelliteMaps" />

    <CustomAEmpty v-if="data?.length === 0 && !isLoadingDefaultMaps && !isLoadingSatelliteMaps" />

    <div
      class="overflow-auto flex flex-1 mr-2"
      v-if="data.length !== 0"
    >
      <ul class="list-none m-0 p-0 w-full">
        <li
          :class="[
            'ml-3 group flex flex-row py-2 pl-2 items-center  rounded-sm mr-3',
            mapActiveId === item.mapId && 'bg-[#353535] bg-opacity-90',
            mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE
              ? 'cursor-no-drop'
              : 'cursor-pointer',
          ]"
          v-for="(item, index) in data"
          :key="index"
          @click="addMap(item)"
        >
          <div class="image-layer">
            <img
              :src="item.mapInfoDto.thumbnailPath"
              :alt="item.mapInfoDto.mapName"
              class="image-layer rounded-sm"
            />
          </div>
          <div class="flex w-full flex-col pl-3">
            <label
              :class="[
                'text-sm font-medium',
                mapActiveId === item.mapId ? 'text-white' : 'text-[#8D8D8D] group-hover:text-main',
                mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE
                  ? 'cursor-no-drop'
                  : 'cursor-pointer',
              ]"
            >
              {{ item?.mapInfoDto.mapName }}
            </label>
            <a-typography-text class="text-xs text-[#7D7D7D]">
              {{ item?.mapInfoDto.createdDate }}
            </a-typography-text>
            <a-typography-text class="text-xs text-[#7D7D7D]">
              Resolution {{ item?.mapInfoDto.resolution?.toUpperCase() }}
            </a-typography-text>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { computed, ref, watch } from 'vue';
import IconDropdownLarger from '@/components/icons/IconDropdownLarger.vue';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import CustomASpin from '@/components/home/CustomASpin.vue';
import { useCategoriesInUnit, useMapsByUnit } from '@/services/hooks/useLayer';
import { notification } from 'ant-design-vue';
import { keyNotificationMap } from '@/utils/constants';
import { ACTIVE_FUNCTION, GROUP_LAYER_TYPE } from '@/utils/enums';
import { useI18n } from 'vue-i18n';
import { useMapToolStore } from '@/stores/mapTool';
import { useLayerStore } from '@/stores/LayerStore';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import { addImageryLayer } from '@/DTP_new/modules/imageryLayer';
import type { LayerResType } from '@/DTP_new/libs/DTP.type';

// TODO: Define store
const layerStore = useLayerStore(); // store save information of all layer(map)
const mapToolStore = useMapToolStore(); // store save information of map Tools

const { t } = useI18n(); // I18n for website in client

const isAddedFirstMap = ref(false); // Checking added map or not added map
const mapActiveId = ref<string>(''); // id of (layer) map is displaying

// TODO: get categories in unit (group layer)
const { data: satelliteCategories } = useCategoriesInUnit(GROUP_LAYER_TYPE.VE_TINH);
const { data: defaultCategories } = useCategoriesInUnit(GROUP_LAYER_TYPE.MAC_DINH);

const selectedType = ref('satellite'); // Type of map: `satellite` || `default`
const keyDefaultMap = ref(); // categoryId (UnitId) of group default map
const keySatelliteMap = ref(); // categoryId (UnitId) of group satellite map

// TODO: Set default key for DefaultMap and Satellite Map
watch(defaultCategories, () => {
  keyDefaultMap.value = defaultCategories.value?.data[0]?.id; // auto get element 0 for set default
});

watch(satelliteCategories, () => {
  keySatelliteMap.value = satelliteCategories.value?.data[0]?.id; // auto get element 0 for set default
});

// TODO: When keyDefaultMap and keySatelliteMap not undefined, we will enable for send request to server to get all Maps
const enabledFetchDefaultMap = computed(() => Boolean(keyDefaultMap.value));
const enabledFetchSatelliteMap = computed(() => Boolean(keySatelliteMap.value));

// TODO: Fetch all defaultMaps from server through Hook mapsByUnit
const { data: defaultMaps, isLoading: isLoadingDefaultMaps } = useMapsByUnit(
  {
    unitId: keyDefaultMap,
  },
  enabledFetchDefaultMap,
);

// TODO: Fetch all defaultMaps from server through Hook mapsByUnit
const { data: satelliteMaps, isLoading: isLoadingSatelliteMaps } = useMapsByUnit(
  {
    unitId: keySatelliteMap,
  },
  enabledFetchSatelliteMap,
);

// TODO: Watch satelliteMaps to fill data to variables
watch(satelliteMaps, async () => {
  const resolutionObj: Record<string, string> = {};
  const dataSatelliteMaps = satelliteMaps?.value?.data || [];

  // Save satellite maps into store
  layerStore.layers = dataSatelliteMaps || [];

  // add first satellite map into viewer
  if (!isAddedFirstMap.value && dataSatelliteMaps[0]) {
    isAddedFirstMap.value = true;
    addMap(dataSatelliteMaps[0]);
  }
  // Extract all kinds of resolution
  dataSatelliteMaps.forEach((m) => {
    if (m.mapInfoDto.resolution) resolutionObj[m.mapInfoDto.resolution] = m.mapInfoDto.resolution;
  });

  // Save resolution into store
  layerStore.resolutionOptions = Object.keys(resolutionObj).map((key) => ({
    label: key,
    value: key,
  }));
});

// TODO: get array layers  follow resolution and  type default or satellite
const data: ComputedRef<LayerResType[]> = computed(() => {
  return (
    (selectedType.value === 'default'
      ? defaultMaps.value?.data
      : layerStore.selectingResolution
        ? satelliteMaps?.value?.data.filter(
            (i) => i.mapInfoDto.resolution === layerStore.selectingResolution,
          )
        : satelliteMaps?.value?.data) || []
  );
});

// TODO: Change basemap
const addMap = (layer: LayerResType) => {
  if (mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE) {
    return;
  }

  // Show notification about map information in top right screen
  //&& !layerStore.isShowLayersDisplayed
  if (!mapToolStore.isShowImageryLayersSplit) {
    notification.open({
      key: keyNotificationMap,
      message: layer.mapInfoDto.mapName,
      description: layer.mapInfoDto.resolution && `Resolution: ${layer.mapInfoDto.resolution}`,
      duration: 2,
    });
  }

  // reFormat layer info to imageryLayerInfo to add into viewer
  const newFormatMap = reFormatMapInfo(layer);
  // Change base map in viewer
  addImageryLayer(newFormatMap, 0);

  // set again active map's ID
  mapActiveId.value = layer.mapId;
};
</script>

<style scoped>
.image-layer {
  width: 56px;
  height: 50px;
}

.container {
  width: 280px;
}
</style>
