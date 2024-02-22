<template>
  <div
    class="flex flex-1 overflow-auto mr-2 mt-2.5"
    v-if="data?.length > 0"
  >
    <ul class="w-full p-0 list-none">
      <li
        :class="['flex flex-col pl-5 pt-2 group', item.id === activeId && 'bg-[#333333]']"
        v-for="(item, index) in data"
        :key="index"
      >
        <div class="flex flex-row">
          <img
            :src="item?.image_url"
            alt="layer-map"
            width="78"
            height="59"
            class="border border-solid border-[#6D6D6D] rounded-sm cursor-pointer"
          />
          <div class="flex flex-row justify-between w-full">
            <div class="flex flex-col pl-3.5">
              <div
                @click="onClickItem(item)"
                class="cursor-pointer"
              >
                <label
                  :class="[
                    'text-sm font-medium cursor-pointer',
                    item.id === activeId ? 'text-main' : 'text-white hover:text-main',
                  ]"
                >
                  {{ item.name }}
                </label>
              </div>
              <div class="flex flex-row items-center mt-0.5">
                <a-typography-text class="text-white text-xs text-date font-normal">
                  Đánh giá: {{ item?.vote }}
                </a-typography-text>
                <a-rate
                  disabled
                  :value="item?.vote"
                  class="ml-2"
                />
              </div>
              <a-typography-text class="text-white text-xs text-date font-normal">
                Trạng thái: {{ item.status }}
              </a-typography-text>
            </div>

            <MoreInfoItem
              :on-delete="() => onDelete(item.id)"
              delete-title="Xóa địa điểm"
              :confirm-txt="`Xác nhận xóa địa điểm ${item.name}`"
            />
          </div>
        </div>
        <div class="h-px w-full bg-[#373737] mt-3" />
      </li>
    </ul>
  </div>

  <CustomASpin :spinning="isLoading && data.length === 0" />

  <CustomAEmpty v-if="!isLoading && data?.length === 0" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { moveToLocation } from '@/DTP/mapTool/camera';
import CustomASpin from '@/components/home/CustomASpin.vue';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import MoreInfoItem from '@/components/home/sections/MoreInfoItem.vue';
import { LOCATIONS_QUERY_KEY, useDeleteLocation, useLocations } from '@/services/hooks/useBookmark';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { PinType } from '@/services/commonTypes';

const props = defineProps<{
  activeBookmarkId?: string;
  searchValue?: string;
}>();

const enabled = computed(() => Boolean(props.activeBookmarkId));

const { data: locations, isLoading } = useLocations(props.activeBookmarkId || '', enabled);

const { mutate } = useDeleteLocation();

const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onDelete = (id: string) => {
  mutate(
    { bookmarkId: props.activeBookmarkId || '', id },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
        handleSuccess(data, 'Xóa địa điểm thành công!');
      },
      onError,
    },
  );
};

const activeId = ref('');

const data: ComputedRef<PinType[]> = computed(() => {
  return (
    locations?.value?.data?.filter((i) =>
      props?.searchValue
        ? i?.name?.toUpperCase()?.includes(props?.searchValue?.toUpperCase())
        : true,
    ) || []
  );
});

const onClickItem = (item: PinType) => {
  activeId.value = item.id;
  moveToLocation({
    lat: item.location[1],
    lng: item.location[0],
  });
};
</script>
