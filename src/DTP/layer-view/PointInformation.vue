<template>
  <div class="pt-4">
    <div class="img-location">
      <img
        style="object-fit: fill"
        :src="info.image_url"
        alt="marker"
        class="img-location"
      />
    </div>

    <div class="mt-2.5 flex flex-row text-white">
      <div>
        <div class="flex flex-row items-center justify-between">
          <p class="m-0 font-sarabun font-medium text-xs xl:text-sm 2xl:text-base">
            {{ info.name }}
          </p>
          <div class="mt-1 cursor-pointer relative">
            <a-dropdown
              placement="bottomLeft"
              :arrow="{ pointAtCenter: true }"
            >
              <a-button
                type="ghost"
                class="border-0 group/three-dot m-0 p-0 w-7 h-7"
                @mouseenter="fetchData"
              >
                <IconBookmarkPopUp class="group-hover/three-dot:text-[#EE0033] text-[#D9D9D9]" />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-for="item in data"
                    :key="item.id"
                    @click="onSave(item)"
                  >
                    <div class="flex flex-row items-center py-1.5 group/item">
                      <IconHeartPopUp class="text-[#BBBBBB] group-hover/item:text-[#EE0033]" />
                      <span class="ml-2 text-[#BBBBBB] group-hover/item:text-[#EE0033] text-xs">
                        {{ item?.bookmarkName }}
                      </span>
                    </div>
                  </a-menu-item>
                  <a-menu-item>
                    <div
                      class="flex flex-row items-center py-1.5 group/add"
                      id="buttonAddNewList"
                      @click="() => store.showModalHandleBookmark()"
                    >
                      <IconAddPopUp class="group-hover/add:text-[#EE0033] text-[#BBBBBB]" />
                      <span class="ml-2 text-[#BBBBBB] text-xs hover:text-[#EE0033]">
                        Danh sách mới
                      </span>
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-4 h-4 mt-1">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_36444_1909)">
                <path
                  d="M7.99992 0.5C4.89942 0.5 2.37695 3.02246 2.37695 6.12297C2.37695 7.24909 2.70705 8.33114 3.33264 9.25983L7.99992 16.5L12.6672 9.25983C13.2928 8.33114 13.6229 7.24909 13.6229 6.12297C13.6229 3.02246 11.1004 0.5 7.99992 0.5ZM7.99992 8.93445C6.44967 8.93445 5.18844 7.67322 5.18844 6.12297C5.18844 4.57272 6.44967 3.31148 7.99992 3.31148C9.55017 3.31148 10.8114 4.57272 10.8114 6.12297C10.8114 7.67322 9.55017 8.93445 7.99992 8.93445Z"
                  fill="#EE0033"
                />
                <line
                  x1="3"
                  y1="16"
                  x2="13"
                  y2="16"
                  stroke="#EE0033"
                />
              </g>
              <defs>
                <clipPath id="clip0_36444_1909">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <p class="m-0 font-sarabun font-normal text-xs xl:text-sm 2xl:text-base pl-2.5">
              Vị trí:
              <span class="font-medium text-xs xl:text-sm 2xl:text-base">{{ info.address }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <label class="text-white text-xs">
        Đánh giá:
        <span>{{ info.vote }}</span>
      </label>
      <a-rate
        disabled
        :value="info.vote"
        class="ml-2"
      />
    </div>
    <div class="mt-1">
      <label class="text-white text-xs">Trạng thái: Đang mở</label>
    </div>
    <div class="flex flex-row items-center mt-2 mb-6">
      <label class="text-white text-xs">Ghi chú:</label>
      <input
        class="ml-3 bg-[#333431] border border-solid text-xs border-[#333431] text-white flex flex-1"
        placeholder="Nhập ghi chú"
        :value="info.note"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import IconHeartPopUp from '@/components/icons/IconHeartPopUp.vue';
import IconBookmarkPopUp from '@/components/icons/IconBookmarkPopUp.vue';
import { fetchBookmarkList, saveBookmarkList } from '@/services/apis/map';
import type { BookmarkListResType } from '@/services/apis/map';
import IconAddPopUp from '@/components/icons/IconAddPopUp.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { notification } from 'ant-design-vue';
import type { PinType } from '@/services/commonTypes';

const props = defineProps<{
  info: PinType;
}>();

const data = ref<BookmarkListResType[]>([]);

const onSave = async (item: BookmarkListResType) => {
  try {
    await saveBookmarkList({
      bookmarkId: item.id,
      addressId: props?.info?.id,
    });
    notification.success({
      message: 'Thông báo',
      description: 'Lưu địa chỉ thành công!',
    });
  } catch (e) {
    notification.error({
      description: 'Lưu địa chỉ thất bại!',
      message: 'Thông báo',
    });
  }
};

const fetchData = async () => {
  try {
    const response = await fetchBookmarkList();
    data.value = response?.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  await fetchData();
});

const store = useMapToolStore();
</script>

<style scoped>
.img-location {
  width: 100%;
  height: 99px;
}

@media (min-width: 1536px) {
  .img-location {
    height: 132px;
  }
}

.ant-dropdown .ant-dropdown-menu,
.ant-dropdown-menu-submenu .ant-dropdown-menu {
  background: rgba(21, 21, 21, 90%);
  border-radius: 5px;
  padding: 8px 20px 12px 20px;
  width: 187px;
}
</style>
