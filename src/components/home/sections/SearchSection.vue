<template>
  <div class="flex flex-row relative">
    <div
      class="flex flex-col bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90 container-section"
    >
      <HeaderSection
        :on-close="onClose"
        title="Tìm kiếm"
      />

      <div class="mx-4 mt-3">
        <a-input
          placeholder="Tìm kiếm"
          class="bg-[#353535]"
          v-model:value="searchValue"
        >
          <template #prefix>
            <IconSearchInput />
          </template>
        </a-input>
      </div>

      <div class="flex flex-col flex-1 overflow-auto pt-4">
        <ul class="p-0 list-none px-4">
          <li
            class="flex flex-col mb-4 group cursor-pointer"
            v-for="item in data"
            :key="item.id"
            @click="moveToLocation({ lat: item.location[1], lng: item.location[0] })"
          >
            <label class="text-xs text-[#BBBBBB] group-hover:text-main font-bold cursor-pointer">
              {{ item.name }}
            </label>
            <a-typography-text class="text-[#797575] text-xs mt-0.5 font-normal">
              {{ item.address }}
            </a-typography-text>
          </li>
        </ul>

        <custom-a-empty v-if="data.length === 0" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import HeaderSection from '@/components/home/sections/HeaderSection.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useSearchAddress } from '@/services/hooks/useLayer';
import type { PinType } from '@/services/commonTypes';
import { moveToLocation } from '@/DTP/mapTool/camera';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';

const store = useMapToolStore();

const onClose = () => {
  store.changeActiveTool();
};

const searchValue = ref<string>('');

const { data: addressData, refetch } = useSearchAddress(searchValue);

const data: ComputedRef<PinType[]> = computed(() => addressData.value?.data || []);

watch(searchValue, () => {
  refetch();
});
</script>
