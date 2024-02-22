import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { LOCAL_STORAGE_KEY, MENU_KEY, ROLE, SCOPE } from '@/utils/enums';
import { useRoute } from 'vue-router';
import {
  ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH,
  ADMIN_APP_PAGE_PATH,
  ADMIN_DATA_TYPE_PAGE_PATH,
  ADMIN_FIELD_PAGE_PATH,
  ADMIN_LOGS_PAGE_PATH,
  ADMIN_MENU_PAGE_PATH,
  ADMIN_POSITION_PAGE_PATH,
  ADMIN_RIGHT_PAGE_PATH,
  ADMIN_UNIT_PAGE_PATH,
  ADMIN_USER_PAGE_PATH,
  ROLE_PAGE_PATH,
} from '@/utils/routePath';
import type { LoginResType } from '@/services/apis/config';
import type { ProfileResType } from '@/services/apis/systemApi';

export const useConfigStore = defineStore('config', () => {
  const accessToken = ref<string | null>(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN));
  const isOpenModalHandleProfile = ref<boolean>(false);
  const isOpenModalSetting = ref<boolean>(false);
  const isOpenModalChangePassword = ref<boolean>(false);
  const userInfo = ref<LoginResType>(
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO) &&
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO) || ''),
  );
  const profile = ref<ProfileResType>();
  const locale = ref(localStorage.getItem(LOCAL_STORAGE_KEY.LOCALE) || 'en');

  const role = computed(() => {
    if (!accessToken.value) {
      return ROLE.VIEWER;
    }

    return userInfo?.value?.scopes.includes(SCOPE.ADMIN_EDIT) ? ROLE.ADMIN : ROLE.USER;
  });

  const route = useRoute();

  const getMenuKey = () => {
    switch (route?.path) {
      case ADMIN_MENU_PAGE_PATH:
        return [MENU_KEY.MENU];
      case ADMIN_APP_PAGE_PATH:
        return [MENU_KEY.APP];
      case ADMIN_USER_PAGE_PATH:
        return [MENU_KEY.USER];
      case ADMIN_RIGHT_PAGE_PATH:
        return [MENU_KEY.RIGHT];
      case ROLE_PAGE_PATH:
        return [MENU_KEY.ROLE];
      case ADMIN_UNIT_PAGE_PATH:
        return [MENU_KEY.UNIT];
      case ADMIN_POSITION_PAGE_PATH:
        return [MENU_KEY.POSITION];
      case ADMIN_LOGS_PAGE_PATH:
        return [MENU_KEY.LOG];
      case ADMIN_DATA_TYPE_PAGE_PATH:
        return [MENU_KEY.DATA_TYPE];
      case ADMIN_FIELD_PAGE_PATH:
        return [MENU_KEY.FIELD];
      case ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH:
        return [MENU_KEY.ADMINISTRATIVE_UNITS];
      default:
        return [];
    }
  };

  const selectedMenuKeys = ref<MENU_KEY[]>(getMenuKey());

  function setAccessToken(newValue: string) {
    accessToken.value = newValue;
  }

  function setUserInfo(newValue: LoginResType) {
    userInfo.value = newValue;
  }

  function setProfile(newValue?: ProfileResType) {
    profile.value = newValue;
  }

  function setOpenModalHandleProfile(newValue: boolean) {
    isOpenModalHandleProfile.value = newValue;
  }

  function setOpenModalChangePassword(newValue: boolean) {
    isOpenModalChangePassword.value = newValue;
  }

  function setOpenModalSetting(newValue: boolean) {
    isOpenModalSetting.value = newValue;
  }

  return {
    accessToken,
    setAccessToken,
    selectedMenuKeys,
    userInfo,
    setUserInfo,
    role,
    profile,
    setProfile,
    isOpenModalHandleProfile,
    setOpenModalHandleProfile,
    setOpenModalChangePassword,
    isOpenModalChangePassword,
    setOpenModalSetting,
    isOpenModalSetting,
    locale,
  };
});
