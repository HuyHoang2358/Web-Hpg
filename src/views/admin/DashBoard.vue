<template>
  <a-config-provider
    :locale="viVN"
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <a-layout has-sider>
      <MenusAdmin />
      <a-layout :style="{ marginLeft: '312px' }">
        <header>
          <HeaderAdmin />
        </header>
        <main>
          <a-layout-content class="m-5">
            <div class="bg-white wrapper-content">
              <RouterView />
            </div>
          </a-layout-content>
        </main>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { LOGIN_PAGE_PATH } from '@/utils/routePath';
import { LOCAL_STORAGE_KEY } from '@/utils/enums';
import { computed } from 'vue';
import router from '@/router';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { theme } from 'ant-design-vue';
import HeaderAdmin from '@/views/admin/HeaderAdmin.vue';
import MenusAdmin from '@/views/admin/MenusAdmin.vue';
import { useProfile } from '@/services/hooks/useSystem';
import { watch } from 'vue';
import { useConfigStore } from '@/stores/config';

const isAuthenticate = computed(() =>
  Boolean(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)),
);

const { data: profileData } = useProfile();
const configStore = useConfigStore();

watch(profileData, () => {
  configStore.setProfile(profileData.value?.data);
});

if (!isAuthenticate.value) {
  router.push(LOGIN_PAGE_PATH);
}
</script>
<style scoped>
.wrapper-content {
  padding: 33px 65px 33px 65px;
  border-radius: 5px;
}
</style>
