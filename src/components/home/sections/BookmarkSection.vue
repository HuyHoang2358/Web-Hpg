<template>
  <div class="flex flex-row relative">
    <div
      class="flex flex-col bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90 container-section"
    >
      <HeaderSection
        :on-close="onClose"
        :title="title || 'ĐỊA ĐIỂM ĐÃ LƯU'"
        :show-back-button="activeId !== undefined"
        :on-back="() => changeActiveId()"
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

      <BookmarkList
        :change-active-id="changeActiveId"
        v-if="activeId === undefined"
        :search-value="searchValue"
      />

      <Locations
        v-else
        :active-bookmark-id="activeId"
        :search-value="searchValue"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import BookmarkList from '@/components/home/sections/BookmarkList.vue';
import Locations from '@/components/home/sections/Locations.vue';
import HeaderSection from '@/components/home/sections/HeaderSection.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useQueryClient } from '@tanstack/vue-query';
import { LOCATIONS_QUERY_KEY } from '@/services/hooks/useBookmark';

const store = useMapToolStore();

const queryClient = useQueryClient();

const onClose = () => {
  store.changeActiveTool();
};

const searchValue = ref<string>('');
const activeId = ref<string>();
const title = ref<string>();

const changeActiveId = (newId?: string, newTitle?: string) => {
  queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
  activeId.value = newId;
  title.value = newTitle;
};
</script>
