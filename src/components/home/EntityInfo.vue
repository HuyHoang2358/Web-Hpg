<template>
  <div
    class="absolute flex justify-center w-full z-50"
    :style="{
      bottom: mapToolStore.isShowBottom ? 195 + 12 + 'px' : 72 + 'px',
    }"
    v-if="entityStore.polygon"
  >
    <div
      :class="['bg-[#151515] bg-opacity-90 py-4 px-8 rounded-sm']"
      style="width: 528px"
    >
      <div class="flex justify-between items-center">
        <div
          class="flex justify-start items-center gap-2 cursor-pointer group"
          @click=""
        >
          <div class="w-10 h-10">
            <IconPolygon />
          </div>
          <div>
            <p class="text-[12px] text-white group-hover:text-[#D0002D] font-bold mb-0">
              {{ entityStore.polygonInfo.name || 'Polygon' }}
            </p>
            <p class="text-[10px] text-[#939393] mb-0 mt-1">
              Diện tích : {{ entityStore.polygonInfo.area || 0 }}
            </p>
          </div>
        </div>
        <div class="flex justify-end items-center gap-2">
          <a-button
            class="bg-[#4D4D4D] border-[#4D4D4D] group"
            shape="circle"
            @click="onSavePolygon"
          >
            <IconSaveFile class="text-[#D9D9D9] group-hover:text-main" />
          </a-button>
          <a-button
            class="bg-[#4D4D4D] border-[#4D4D4D] group"
            shape="circle"
            @click="onRemovePolygon"
          >
            <IconClose class="text-[#D9D9D9] group-hover:text-main" />
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconSaveFile from '@/components/icons/IconSaveFile.vue';
import IconPolygon from '@/components/icons/IconPolygon.vue';
import IconClose from '@/components/icons/tools/IconClose.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useEntityStore } from '@/stores/entity';
import { removeCurrentPolygon } from '@/DTP/entity';

const mapToolStore = useMapToolStore();
const entityStore = useEntityStore();

const onRemovePolygon = () => {
  entityStore.isDrawPolygon = false;
  removeCurrentPolygon();
};

const onSavePolygon = () => {
  if (entityStore.polygonInfo.id) {
    mapToolStore.showModalHandleCaringArea({
      mode: 'edit',
    });
    return;
  }
  mapToolStore.showModalHandleCaringArea({
    mode: 'create',
  });
};
</script>
