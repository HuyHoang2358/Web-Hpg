<template>
  <a-layout-sider class="sider">
    <div class="py-3.5 flex flex-row justify-center items-center relative">
      <div class="absolute left-4">
        <a
          class="group h-10 w-10 m-0 p-0"
          :href="HOME_PAGE_PATH"
        >
          <IconHomeAdmin class="text-[#454545] group-hover:text-[#EE0033]" />
        </a>
      </div>
      <img
        src="/images/auth/logo-viettel.png"
        alt="logo-viettel"
        class="logo"
      />
    </div>
    <a-divider class="h-px bg-[#373737] m-0 p-0" />

    <a-menu
      v-model:selectedKeys="configStore.selectedMenuKeys"
      theme="dark"
      mode="inline"
      class="mt-20"
      :open-keys="['system', 'data']"
    >
      <a-sub-menu key="system">
        <template #title>
          <span class="ml-3 font-medium font-sarabun text-lg">Quản trị hệ thống</span>
        </template>
        <MenuItem
          :path="ADMIN_USER_PAGE_PATH"
          :menu-key="MENU_KEY.USER"
          title="Quản lý Người dùng"
        >
          <IconUser />
        </MenuItem>
        <MenuItem
          :path="ADMIN_UNIT_PAGE_PATH"
          :menu-key="MENU_KEY.UNIT"
          title="Quản lý Đơn vị"
        >
          <IconField />
        </MenuItem>
        <MenuItem
          :path="ADMIN_MENU_PAGE_PATH"
          :menu-key="MENU_KEY.MENU"
          title="Quản lý Chức năng"
        >
          <IconDashboard />
        </MenuItem>
        <MenuItem
          :path="ADMIN_RIGHT_PAGE_PATH"
          :menu-key="MENU_KEY.RIGHT"
          title="Quản lý Quyền người dùng"
        >
          <IconRole />
        </MenuItem>
        <MenuItem
          :path="ROLE_PAGE_PATH"
          :menu-key="MENU_KEY.ROLE"
          title="Quản lý Vai trò"
        >
          <IconUserRole />
        </MenuItem>
        <MenuItem
          :path="ADMIN_POSITION_PAGE_PATH"
          :menu-key="MENU_KEY.POSITION"
          title="Quản lý Chức danh"
        >
          <IconPosition />
        </MenuItem>
        <MenuItem
          :path="ADMIN_LOGS_PAGE_PATH"
          :menu-key="MENU_KEY.LOG"
          title="Quản lý Nhật ký hệ thống"
        >
          <IconApp />
        </MenuItem>
      </a-sub-menu>
      <a-sub-menu key="data">
        <template #title>
          <span class="ml-3 font-medium font-sarabun text-lg">Quản lý dữ liệu</span>
        </template>
        <MenuItem
          :path="ADMIN_DATA_TYPE_PAGE_PATH"
          :menu-key="MENU_KEY.DATA_TYPE"
          title="Quản lý Loại dữ liệu"
        >
          <IconApp />
        </MenuItem>
        <MenuItem
          :path="ADMIN_FIELD_PAGE_PATH"
          :menu-key="MENU_KEY.FIELD"
          title="Quản lý Lĩnh vực"
        >
          <IconApp />
        </MenuItem>
        <MenuItem
          :path="ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH"
          :menu-key="MENU_KEY.ADMINISTRATIVE_UNITS"
          title="Quản lý Đơn vị hành chính"
        >
          <IconApp />
        </MenuItem>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
<script setup lang="ts">
import {
  ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH,
  ADMIN_DATA_TYPE_PAGE_PATH,
  ADMIN_FIELD_PAGE_PATH,
  ADMIN_LOGS_PAGE_PATH,
  ADMIN_MENU_PAGE_PATH,
  ADMIN_POSITION_PAGE_PATH,
  ADMIN_RIGHT_PAGE_PATH,
  ADMIN_UNIT_PAGE_PATH,
  ADMIN_USER_PAGE_PATH,
  HOME_PAGE_PATH,
  ROLE_PAGE_PATH,
} from '@/utils/routePath';
import { MENU_KEY } from '@/utils/enums';
import IconPosition from '@/components/icons/admin/IconPosition.vue';
import IconRole from '@/components/icons/admin/IconRole.vue';
import MenuItem from '@/views/admin/MenuItem.vue';
import IconApp from '@/components/icons/admin/IconApp.vue';
import IconUser from '@/components/icons/admin/IconUser.vue';
import IconHomeAdmin from '@/components/icons/home/IconHomeAdmin.vue';
import IconDashboard from '@/components/icons/admin/IconDashboard.vue';
import IconField from '@/components/icons/admin/IconField.vue';
import { useConfigStore } from '@/stores/config';
import IconUserRole from '@/components/icons/admin/IconUserRole.vue';

const configStore = useConfigStore();
</script>

<style scoped>
.sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.logo {
  width: 138px;
  height: 54px;
}
</style>
