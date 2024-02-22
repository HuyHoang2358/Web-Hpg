<template>
  <div
    class="flex flex-1 overflow-auto mb-4 mr-3 mt-3"
    v-if="data && data?.length > 0"
  >
    <ul class="pl-4 w-full p-0 list-none">
      <li
        class="flex flex-row justify-between cursor-pointer py-2.5"
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="flex flex-row group/item m-0 p-0"
          @click="changeActiveId(item.id, item.bookmarkName)"
        >
          <div class="w-3 h-3 mt-0.5">
            <IconHeart class="group-hover/item:text-[#EE0033] text-[#BBBBBB]" />
          </div>
          <a-typography-text class="ml-2 text-[#BBBBBB] text-xs group-hover/item:text-[#EE0033]">
            {{ item.bookmarkName }}
          </a-typography-text>
        </div>
        <MoreInfoItem
          :on-edit="() => store.showModalHandleBookmark(item)"
          :on-delete="() => onDelete(item?.id)"
          edit-title="Cập nhật thông tin"
          delete-title="Xóa danh sách"
          :confirm-txt="`Xác nhận xóa ${item.bookmarkName}?`"
        />
      </li>
    </ul>
  </div>

  <CustomASpin :spinning="isLoading && !isSuccess" />
  <CustomAEmpty v-if="isSuccess && data?.length === 0" />
</template>
<script setup lang="ts">
import IconHeart from '@/components/icons/IconHeart.vue';
import {
  BOOKMARK_LIST_QUERY_KEY,
  useBookmarkList,
  useDeleteBookmark,
} from '@/services/hooks/useBookmark';
import MoreInfoItem from '@/components/home/sections/MoreInfoItem.vue';
import CustomASpin from '@/components/home/CustomASpin.vue';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { BookmarkListResType } from '@/services/apis/map';

const props = defineProps<{
  changeActiveId: (index: string, title: string) => void;
  searchValue?: string;
}>();

const store = useMapToolStore();

const { data: bookmarks, isSuccess, isLoading } = useBookmarkList();

const { mutate } = useDeleteBookmark();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const queryClient = useQueryClient();

const onDelete = (id: string) => {
  mutate(id, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [BOOKMARK_LIST_QUERY_KEY] });
      handleSuccess(data, 'Xóa danh sách thành công!');
    },
    onError,
  });
};

const data: ComputedRef<BookmarkListResType[]> = computed(() =>
  bookmarks?.value
    ? bookmarks.value?.data.filter((i) =>
        props?.searchValue
          ? i?.bookmarkName?.toUpperCase()?.includes(props?.searchValue?.toUpperCase())
          : true,
      )
    : [],
);
</script>
