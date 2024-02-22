<template>
  <div class="flex flex-row justify-end">
    <!--    <a-button
      type="ghost"
      @click="changeLanguage"
    >
      {{ configStore.locale }}
    </a-button>-->
    <div class="flex flex-row items-center dark-form">
      <a
        class="flex items-center h-8 group"
        :href="LOGIN_PAGE_PATH"
        v-if="!isAuthenticate"
      >
        <IconProfile class="mr-3 text-[#FAFAFA] group-hover:text-main" />
        <a-typography-text class="text-[#FAFAFA] font-normal text-xs group-hover:text-main">
          Đăng nhập
        </a-typography-text>
      </a>

      <a-dropdown
        placement="bottom"
        :arrow="{ pointAtCenter: true }"
        trigger="click"
      >
        <a-button
          type="ghost"
          @click="openMenu"
        >
          <Icon3D />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="viewCity('HP')">
              <div class="flex items-center my-2">
                <IconLocation class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs w-32">
                  Hai Phong City
                </a-typography-text>
                <a-button
                  type="ghost"
                  class="w-4 h-4 p-0 m-0"
                >
                  <IconEyeOnHome
                    :class="displayingCity === 'HP' ? 'text-red-500' : 'text-[#7A7A7A]'"
                  />
                </a-button>
              </div>
            </a-menu-item>

            <a-menu-item @click="viewCity('DN')">
              <div class="flex items-center my-2">
                <IconLocation class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs w-32">
                  Da Nang City
                </a-typography-text>
                <a-button
                  type="ghost"
                  class="w-4 h-4 p-0 m-0"
                >
                  <IconEyeOnHome
                    :class="displayingCity === 'DN' ? 'text-red-500' : 'text-[#7A7A7A]'"
                  />
                </a-button>
              </div>
            </a-menu-item>

            <a-menu-item @click="viewCity('TD')">
              <div class="flex items-center my-2">
                <IconLocation class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs w-32">
                  Thu Duc City
                </a-typography-text>
                <a-button
                  type="ghost"
                  class="w-4 h-4 p-0 m-0"
                >
                  <IconEyeOnHome
                    :class="displayingCity === 'TD' ? 'text-red-500' : 'text-[#7A7A7A]'"
                  />
                </a-button>
              </div>
            </a-menu-item>

            <a-menu-item @click="viewCity('HN')">
              <div class="flex items-center my-2">
                <IconLocation class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs w-32">
                  Ha Noi City
                </a-typography-text>
                <a-button
                  type="ghost"
                  class="w-4 h-4 p-0 m-0"
                >
                  <IconEyeOnHome
                    :class="displayingCity === 'HN' ? 'text-red-500' : 'text-[#7A7A7A]'"
                  />
                </a-button>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown
        placement="bottomLeft"
        :arrow="{ pointAtCenter: true }"
        trigger="click"
      >
        <a-button
          type="ghost"
          @click="openMenu"
          v-if="isAuthenticate"
        >
          <IconProfile class="text-white" />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="onShowSetting">
              <div class="flex items-center my-2">
                <IconSetting class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs">
                  Cài đặt tài khoản
                </a-typography-text>
              </div>
            </a-menu-item>

            <a-menu-item
              @click="onLogout"
              v-if="isAuthenticate"
            >
              <div class="flex items-center my-2">
                <IconLogOutAccount class="mr-3 text-[#BBBBBB]" />
                <a-typography-text class="text-[#BBBBBB] font-normal text-xs">
                  Đăng xuất
                </a-typography-text>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <div
        class="flex flex-col items-start"
        v-if="isAuthenticate"
      >
        <a-typography-text class="text-[#FAFAFA] text-xs font-medium">
          {{ configStore?.profile?.name }}
        </a-typography-text>
        <a-typography-text
          class="text-[#7D7D7D] text-xs text-[10px] font-medium whitespace-nowrap overflow-hidden w-12 overflow-ellipsis"
        >
          {{ configStore?.profile?.positionId }}
        </a-typography-text>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconProfile from '@/components/icons/IconProfile.vue';
import { LOGIN_PAGE_PATH } from '@/utils/routePath';
import { notification } from 'ant-design-vue';
import { keyNotificationMap } from '@/utils/constants';
import { computed, ref } from 'vue';
import { LOCAL_STORAGE_KEY } from '@/utils/enums';
import IconLogOutAccount from '@/components/icons/home/IconLogOutAccount.vue';
import { useConfigStore } from '@/stores/config';
import { useMutationProfile } from '@/services/hooks/useSystem';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import IconSetting from '@/components/icons/IconSetting.vue';
import { i18n } from '@/utils/i18n';
import IconLocation from '@/components/icons/home/IconLocation.vue';
import IconEyeOnHome from '@/components/icons/home/IconEyeHome.vue';
import Icon3D from '@/components/icons/home/Icon3D.vue';
import {
  removeAllCityObj,
  viewCityFromJson,
  viewCityFromTileSet,
} from '@/DTP_new/modules/viewCity';
import { flyToPosition } from '@/DTP_new/modules/camera';
import {
  DANANG_CENTER_POINT,
  HAIPHONG_CENTER_POSITION,
  HANOI_CENTER_POINT,
} from '@/DTP_new/configs/constant';

const configStore = useConfigStore();

const { mutate: fetchProfile } = useMutationProfile();

const { onError } = useErrorHandler();
const onShowSetting = () => {
  fetchProfile(undefined, {
    onError,
    onSuccess(data) {
      configStore.setProfile(data?.data);
      configStore.setOpenModalSetting(true);
    },
  });
};

const isAuthenticate = computed(() =>
  Boolean(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)),
);

const changeLanguage = () => {
  if (configStore.locale === 'vi') {
    i18n.global.locale.value = 'en';
    localStorage.setItem(LOCAL_STORAGE_KEY.LOCALE, 'en');
    configStore.locale = 'en';
  } else if (configStore.locale === 'en') {
    i18n.global.locale.value = 'vi';
    localStorage.setItem(LOCAL_STORAGE_KEY.LOCALE, 'vi');
    configStore.locale = 'vi';
  }
  window.location.reload();
};

const openMenu = () => {
  notification.close(keyNotificationMap);
};

const onLogout = () => {
  localStorage.clear();
  window.location.reload();
};
// TODO: VIEW CITY

const displayingCity = ref<string>('');

const viewCity = (cityId: string) => {
  console.log('viewCity', cityId);
  // TODO: remove displaying city out of viewer
  removeAllCityObj();

  // check if cityId == displaying City
  if (displayingCity.value === cityId) {
    displayingCity.value = '';
    flyToPosition(HAIPHONG_CENTER_POSITION);
    return;
  }
  displayingCity.value = cityId;

  switch (cityId) {
    case 'TD':
      viewCityFromTileSet('/data3D/thuduc/tileset.json');
      break;
    case 'HP':
      viewCityFromTileSet('/data3D/haiphong_30_05/tileset.json', true);
      flyToPosition(HAIPHONG_CENTER_POSITION);
      break;
    case 'HN':
      viewCityFromJson('/data3D/json/HN_json.json');
      flyToPosition(HANOI_CENTER_POINT);
      break;
    case 'DN':
      viewCityFromJson('/data3D/json/DN_json.json');
      flyToPosition(DANANG_CENTER_POINT);
      break;
    default:
      break;
  }
};
</script>
