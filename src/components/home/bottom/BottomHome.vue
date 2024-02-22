<template>
  <div class="w-screen">
    <div class="relative">
      <a-button
        class="right-3 absolute -top-6 group flex flex-row items-center bg-[#262626] h-6 bg-opacity-90 border-none rounded-none rounded-t-md"
        @click="onToggle"
      >
        <a-typography-text class="text-[#FCFCFC] font-normal text-xs group-hover:text-main">
          {{ isShowBottom ? t('collapse') : t('expanded') }}
        </a-typography-text>
        <IconCollapse
          :class="[
            'ml-2 group-hover:text-main text-white',
            isShowBottom ? 'rotate-0' : 'rotate-180',
          ]"
        />
      </a-button>

      <a-collapse
        v-model:activeKey="mapToolStore.activeKeyBottomCollapse"
        ghost
      >
        <a-collapse-panel :key="activeKeyBottomHome">
          <div class="flex flex-row bg-[#151515] px-3 bg-opacity-70 py-2.5">
            <SatelliteAndDefaultBasemaps />
            <div class="flex flex-col action-container ml-3">
              <BottomMenus />
              <SearchImages v-if="mapToolStore.activeFunction === ACTIVE_FUNCTION.SEARCH_IMAGES" />
              <DetectChange v-if="mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE" />
              <DefaultState
                v-if="
                  mapToolStore.activeFunction === ACTIVE_FUNCTION.DEFAULT ||
                  mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_OBJECT
                "
              />
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div
      class="w-full bg-[#151515] bg-opacity-50 py-3.5"
      v-if="!mapToolStore.isShowBottom"
    >
      <div>
        <a-typography-text class="text-[#EE0033] font-normal text-sm underline ml-4">
          @ Viettel Digital Twin Platform
        </a-typography-text>
        <a-typography-text class="text-[#EE0033] font-normal text-sm underline ml-4">
          Copyright 2024 Viettel AI. - All Rights Reserved
        </a-typography-text>
        <a-typography-text class="text-[#EE0033] font-normal text-sm underline ml-7 cursor-pointer">
          Contact Us
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconCollapse from '@/components/icons/home/IconCollapse.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { activeKeyBottomHome } from '@/utils/constants';
import SatelliteAndDefaultBasemaps from '@/components/home/bottom/SatelliteAndDefaultBasemaps.vue';
import BottomMenus from '@/components/home/bottom/BottomMenus.vue';
import SearchImages from '@/components/home/bottom/SearchImages.vue';
import { ACTIVE_FUNCTION } from '@/utils/enums';
import DefaultState from '@/components/home/bottom/DefaultState.vue';
import DetectChange from '@/components/home/bottom/DetectChange.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const mapToolStore = useMapToolStore();
const { t } = useI18n();
const isShowBottom = computed(() => mapToolStore.isShowBottom);

const onToggle = () => {
  mapToolStore.isShowBottom ? mapToolStore.hideBottomHome() : mapToolStore.showBottomHome();
};
</script>

<style scoped>
.action-container {
  width: calc(100% - (280px + 12px));
}
</style>
