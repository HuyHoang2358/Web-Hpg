<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    row-class-name="cursor-pointer"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="16">
          <h1 class="text-3xl mb-1">Danh sách vai trò</h1>
        </a-col>
        <a-col :span="8">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
            >
              Thêm mới
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconUserGroup)"
            @click="onAddRightToRole(record.roleId)"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            :icon="h(IconUserRole)"
            @click="onAddMenuToRole(record.roleId)"
          />
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            title="Xác nhận xóa vai trò?"
            @confirm="confirm(record.roleId)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleRole
    :close="() => (open = false)"
    :open="open"
    :current-role="currentRole"
  />
  <ModalAddRightRole
    :close="() => (openAddRightToRole = false)"
    :open="openAddRightToRole"
    :right-in-role="rightInRole"
    :role-id="currentRoleId"
  />
  <ModalAddMenuRole
    :close="() => (openAddMenuToRole = false)"
    :open="openAddMenuToRole"
    :menu-in-role="menuInRole"
    :role-id="currentRoleId"
  />
</template>
<script lang="ts" setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { ref, h, computed } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import {
  ROLE_QUERY_KEY,
  useDeleteRole,
  useFetchDetailRole,
  useRoles,
} from '@/services/hooks/useSystem';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { MenuInRole, RightInRole, RoleResType } from '@/services/apis/systemApi';
import ModalHandleRole from '@/components/admin/ModalHandleRole.vue';
import { useQueryClient } from '@tanstack/vue-query';
import IconUserGroup from '@/components/icons/admin/IconUserGroup.vue';
import ModalAddRightRole from '@/components/admin/ModalAddRightRole.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import ModalAddMenuRole from '@/components/admin/ModalAddMenuRole.vue';
import IconUserRole from '@/components/icons/admin/IconUserRole.vue';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const open = ref<boolean>(false);
const openAddRightToRole = ref<boolean>(false);
const openAddMenuToRole = ref<boolean>(false);
const currentRole = ref<RoleResType>();
const rightInRole = ref<RightInRole[]>([]);
const menuInRole = ref<MenuInRole[]>([]);
const currentRoleId = ref<string>();
const queryClient = useQueryClient();
const { mutate: deleteRole } = useDeleteRole();
const { mutate: getRole } = useFetchDetailRole();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { data, isLoading } = useRoles();

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentRole.value = undefined;
  showModal();
};

const onEdit = (menu: RoleResType) => {
  currentRole.value = menu;
  showModal();
};

const searchValue = ref<string>('');

const dataSource: ComputedRef<RoleResType[]> = computed(
  () =>
    data?.value?.data?.filter(
      (i) => i?.roleName?.toUpperCase().includes(searchValue.value?.toUpperCase()),
    ) || [],
);

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteRole([id], {
      onSuccess(data) {
        handleSuccess(data, 'Xóa vai trò thành công!');
        queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const onAddRightToRole = (id: string) => {
  getRole(id, {
    onSuccess(data) {
      rightInRole.value = data?.data?.rightInRole || [];
      currentRoleId.value = id;
      openAddRightToRole.value = true;
    },
  });
};

const onAddMenuToRole = (id: string) => {
  getRole(id, {
    onSuccess(data) {
      menuInRole.value = data?.data?.menuInRole || [];
      currentRoleId.value = id;
      openAddMenuToRole.value = true;
    },
  });
};

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'Tên vai trò',
    dataIndex: 'roleName',
  },
  {
    title: 'ID vai trò',
    dataIndex: 'roleId',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
];
</script>
