<template>
  <div
    class="flex flex-col bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90 container-section"
  >
    <HeaderSection
      :on-close="() => mapToolStore.changeActiveTool()"
      title="KHU VỰC QUAN TÂM"
    />

    <div
      class="flex flex-1 overflow-auto mr-2"
      v-if="data && data?.length > 0"
    >
      <ul class="w-full p-0 list-none">
        <li
          :class="[
            'flex flex-col pl-5 pt-2',
            mapToolStore.activeAreaIds.includes(item.id) && 'bg-[#333333]',
          ]"
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="flex flex-row group">
            <IconPolygonList class="text-white group-hover:text-main" />
            <div class="flex flex-row justify-between w-full">
              <div class="flex flex-col pl-3.5">
                <div
                  @click="onClickItem(item)"
                  class="cursor-pointer"
                >
                  <label
                    :class="[
                      'text-sm  font-medium cursor-pointer',
                      mapToolStore.activeAreaIds.includes(item.id)
                        ? 'text-main'
                        : 'text-[#C0C0C0] group-hover:text-main',
                    ]"
                  >
                    {{ item?.name }}
                  </label>
                </div>
                <a-typography-text class="text-[#C0C0C0] text-xs mt-0.5 text-date font-normal">
                  {{ item?.area }}
                </a-typography-text>
                <a-typography-text
                  class="text-[#C0C0C0] text-xs mt-0.5 text-date font-normal overflow-hidden"
                >
                  Mô tả: {{ item?.description }}
                </a-typography-text>
              </div>

              <MoreInfoItem
                :on-edit="() => onEditItem(item)"
                :on-delete="() => onDelete(item)"
                :confirm-txt="`Xác nhận xóa khu vực: ${item.name}?`"
                edit-title="Cập nhật thông tin"
                delete-title="Xóa khu vực quan tâm"
              />
            </div>
          </div>
          <div class="h-px w-full bg-[#373737] mt-5" />
        </li>
      </ul>
    </div>

    <CustomASpin :spinning="isLoading && !isSuccess" />

    <CustomAEmpty v-if="!isLoading && data?.length === 0" />

    <a-button
      class="group flex justify-center items-center bg-[#222222] border border-dashed border-[#86001D] text-sm text-[#BBBBBB] m-4 mt-3"
      @click="
        () =>
          mapToolStore.showModalHandleCaringArea({
            mode: 'create',
          })
      "
    >
      <IconAddLayer class="mr-1.5 group-hover:text-[#de2346] text-[#BBBBBB]" />
      Thêm mới khu vực quan tâm
    </a-button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useMapToolStore } from '@/stores/mapTool';
import IconPolygonList from '@/components/icons/home/IconPolygonList.vue';
import HeaderSection from '@/components/home/sections/HeaderSection.vue';
import MoreInfoItem from '@/components/home/sections/MoreInfoItem.vue';
import {
  CARING_AREA_QUERY_KEY,
  useCaring,
  useDeleteCaringArea,
} from '@/services/hooks/useBookmark';
import CustomASpin from '@/components/home/CustomASpin.vue';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import type { CaringAreaResType } from '@/services/apis/map';
import { notification } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import IconAddLayer from '@/components/icons/home/IconAddLayer.vue';
import { useMapStore } from '@/stores/map';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { createPolygonByCaringInfo } from '@/DTP/entity';
import { useEntityStore } from '@/stores/entity';

const mapToolStore = useMapToolStore();
const entityStore = useEntityStore();
const mapStore = useMapStore();
const { data: areas, isLoading, isSuccess } = useCaring();
const { mutate } = useDeleteCaringArea();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();

const data: ComputedRef<CaringAreaResType[]> = computed(() => areas?.value?.data || []);

const polygonIndexObj = ref<Record<string, number>>({});

const onDelete = (item: CaringAreaResType) => {
  mutate(item.id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARING_AREA_QUERY_KEY] });
      notification.success({
        message: 'Xóa khu vực quan tâm thành công!',
      });
      const polygonIndex = polygonIndexObj.value[item.id];
      if (polygonIndex !== undefined) {
        mapToolStore.removeActiveAreaId(mapStore.getPolygonId(polygonIndex) as string);
        mapStore.getMarker(polygonIndex)?.remove();
        mapStore.removePolygonItem(polygonIndex);
      }
    },
    onError,
  });
};

const onEditItem = (item: CaringAreaResType) => {
  mapToolStore.setPolygonHandleIndex(polygonIndexObj.value[item.id]);
  mapToolStore.showModalHandleCaringArea({
    mode: 'edit',
  });
  entityStore.polygonInfo = item;
};

const onClickItem = (item: CaringAreaResType) => {
  if (mapToolStore.activeAreaIds.includes(item.id)) {
    return;
  }

  createPolygonByCaringInfo(item);
};
</script>
