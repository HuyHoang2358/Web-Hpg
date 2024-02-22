<template>
  <div
    :class="[
      'right-content rounded-sm flex flex-col absolute right-3 z-50 bg-[#151515] bg-opacity-90',
      !isCollapse ? 'right-content' : 'w-8',
    ]"
    v-if="layersStore.isShowLayersDisplayed"
    :style="{
      height: remainHeight - 32 - 24 + 'px',
    }"
  >
    <div
      class="group absolute w-6 text-center top-8 2xl:top-10 -left-6 bg-[#262626] bg-opacity-90 cursor-pointer rounded-tl-md rounded-bl-md py-3"
      @click="isCollapse = !isCollapse"
    >
      <IconCollapse
        :class="['group-hover:text-main text-white', !isCollapse ? '-rotate-90' : 'rotate-90']"
      />
    </div>
    <div
      class="w-full flex flex-row justify-between items-center bg-[#1C1C1C] bg-opacity-50 pl-5 h-8 2xl:h-10"
      v-if="!isCollapse"
    >
      <a-typography-text class="text-white font-medium text-xs 2xl:text-sm uppercase">
        Displaying Layers
      </a-typography-text>
      <a-button
        @click="removeAllLayer"
        type="ghost"
        class="group"
      >
        <IconCloseReport class="text-[#9D9D9D] group-hover:text-main" />
      </a-button>
    </div>
    <div v-if="isCollapse">
      <a-button
        @click="removeAllLayer"
        type="ghost"
        class="group w-8 p-0"
      >
        <IconCloseReport class="text-[#9D9D9D] group-hover:text-main" />
      </a-button>
    </div>

    <a-divider class="h-px bg-[#373737] m-0 p-0" />

    <div
      class="flex flex-1 overflow-x-scroll w-full"
      v-if="!isCollapse"
    >
      <VueDraggableNext
        class="list-group w-full"
        tag="ul"
        :list="layerStatusArray.map((i, index) => ({ ...i, order: index + 1 }))"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
        @change="change"
      >
        <transition-group
          type="transition"
          name="flip-list"
        >
          <li
            v-for="element in layerStatusArray.map((i, index) => ({ ...i, order: index + 1 }))"
            :key="element.mapId"
            :class="[
              'list-group-item flex flex-col pt-4 group cursor-pointer rounded-sm',
              element.isSelected && 'bg-[#333333]',
            ]"
          >
            <div class="flex flex-row w-full px-2">
              <div class="img-layer">
                <img
                  :src="element?.mapInfoDto.thumbnailPath"
                  alt="layer-map"
                  class="border border-solid border-[#6D6D6D] rounded-sm object-fill img-layer"
                />
              </div>

              <div class="flex flex-1 flex-row justify-between">
                <div
                  class="flex flex-col pl-3.5"
                  @click="onToggleSelectedItem(element.mapId)"
                >
                  <div>
                    <IconPublic />
                    <label :class="['text-sm font-medium ml-1 cursor-pointer text-white']">
                      {{ element?.mapInfoDto.mapName }}
                    </label>
                  </div>
                  <a-typography-text class="text-white text-xs mt-0.5 text-date font-normal">
                    Time: {{ element?.mapInfoDto.createdDate }}
                    <br />
                    Scale: {{ element?.mapInfoDto.resolution }}
                  </a-typography-text>
                </div>

                <a-button
                  type="ghost"
                  class="w-4 h-4 p-0 m-0 ml-3.5"
                  @click="onToggleVisible(element)"
                >
                  <IconEyeOnHome :class="[element?.isVisible ? 'text-white' : 'text-[#7A7A7A]']" />
                </a-button>
              </div>
            </div>
            <div class="h-px w-full bg-[#373737] mt-4" />
          </li>
        </transition-group>
      </VueDraggableNext>
    </div>

    <div v-if="layerStatusArray.find((i) => i.isSelected) && !isCollapse">
      <a-divider class="h-px bg-[#373737] m-0 p-0 mb-5" />

      <a-typography-text class="text-[#FAFAFA] text-sm uppercase font-medium py-2 px-5">
        Change opacity layer
      </a-typography-text>

      <a-slider
        v-model:value="opacity"
        :marks="marks"
        class="mx-5"
        @change="onChangeSlider"
      >
        <template #mark="{ label, point }">
          <template v-if="point === 100">
            <strong>{{ label }}</strong>
          </template>
          <template v-else>{{ label }}</template>
        </template>
      </a-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import IconCloseReport from '@/components/icons/IconCloseReport.vue';
import IconPublic from '@/components/icons/home/IconPublic.vue';
import IconEyeOnHome from '@/components/icons/home/IconEyeHome.vue';
import IconCollapse from '@/components/icons/home/IconCollapse.vue';

import { changeOrderLayers } from '@/DTP/mapTool/layers';
import useWindowResize from '@/utils/hooks';
import type { LayerResType } from '@/DTP/DTP.type';

import { VueDraggableNext } from 'vue-draggable-next';
import { arrayMove } from '@/DTP/common';
import { useLayersStore } from '@/stores/layers';
import {
  changeOpacityLayers,
  hideImageryLayer,
  removeALlImageryLayer,
  showImageryLayer,
} from '@/DTP_new/modules/imageryLayer';

const { remainHeight } = useWindowResize();

type LayerStatusType = {
  isVisible: boolean;
  currentOpacity: number;
  isSelected: boolean;
} & LayerResType;

const layerStatusArray = ref<LayerStatusType[]>([]);
const opacity = ref<number>(100);
const isDragging = ref(false);
const isCollapse = ref<boolean>(false);
const layersStore = useLayersStore();

const dragOptions = ref({
  animation: 0,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
});

const change = (event: { moved: { element: Element; oldIndex: number; newIndex: number } }) => {
  layerStatusArray.value = arrayMove(
    layerStatusArray.value,
    event.moved.oldIndex,
    event.moved.newIndex,
  );
  changeOrderLayers(event.moved.oldIndex, event.moved.newIndex);
};

watch(
  () => layersStore.layersDisplayed,
  () => {
    isCollapse.value = false;
  },
);

// watch(layerStatusArray, () => {
//   changeOrderLayers(layerStatusArray.value.filter((i) => i.isVisible).map((i) => i.id));
// });

watch(
  () => layersStore.layersDisplayed,
  () => {
    layerStatusArray.value = layersStore.layersDisplayed.map((item) => {
      const currentItem = layerStatusArray.value.find((i) => i.mapId === item.mapId);
      if (currentItem) {
        return {
          ...currentItem,
          isSelected: false,
        };
      }
      opacity.value = 100;
      return {
        ...item,
        isVisible: true,
        currentOpacity: 100,
        isSelected: true,
      };
    });
  },
);

const onToggleSelectedItem = (id: string) => {
  layerStatusArray.value = layerStatusArray.value.map((i) => {
    if (i.mapId === id) {
      if (i.isSelected) {
        return {
          ...i,
          isSelected: false,
        };
      }
      opacity.value = i.currentOpacity;
      return {
        ...i,
        isSelected: true,
      };
    } else return i;
  });
};

const onToggleVisible = async (item: LayerStatusType) => {
  if (item && item.isVisible) {
    layerStatusArray.value = layerStatusArray.value.map((i) => {
      if (i.mapId === item.mapId) {
        return {
          ...i,
          isVisible: false,
        };
      } else return i;
    });
    hideImageryLayer(item.mapId);
  } else {
    layerStatusArray.value = layerStatusArray.value.map((i) => {
      if (i.mapId === item.mapId) {
        return {
          ...i,
          isVisible: true,
        };
      } else return i;
    });
    showImageryLayer(item.mapId);
  }
};

const marks = ref<Record<number, string>>({
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
});

const removeAllLayer = () => {
  layersStore.removeAllLayerDisplayed();
  removeALlImageryLayer();
};

// TODO: Change opacity of list layer
const onChangeSlider = (opacityValue: number) => {
  const activeLayerIds = layerStatusArray.value.filter((i) => i.isSelected).map((i) => i.mapId);
  layerStatusArray.value = layerStatusArray.value.map((i) => {
    if (activeLayerIds.includes(i.mapId)) {
      return {
        ...i,
        currentOpacity: opacityValue,
      };
    } else return i;
  });
  changeOpacityLayers(activeLayerIds, opacityValue);
};
</script>

<style scoped>
.img-layer {
  width: 98px;
  height: 70px;
}

.list-group {
  min-height: 20px;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
