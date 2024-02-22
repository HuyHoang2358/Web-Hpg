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
          <h1 class="text-3xl mb-1">Danh sách chức năng</h1>
        </a-col>
        <a-col :span="8">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
              @search="onSearch"
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
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            :title="`Xác nhận xóa chức năng ${record?.name || ''}?`"
            @confirm="confirm(record?.id)"
            @cancel="cancel"
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
  <ModalHandleMenu
    :open="open"
    :close="() => (open = false)"
    :current-menu="currentMenu"
    :data-tree-select="dataSource"
  />
</template>
<script lang="ts" setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { ref, h, computed } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import { MENUS_QUERY_KEY, useDeleteMenu, useMenus } from '@/services/hooks/useSystem';
import type { MenuResType } from '@/services/apis/systemApi';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import ModalHandleMenu from '@/components/admin/ModalHandleMenu.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { listToTree } from '@/DTP/common';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const open = ref<boolean>(false);
const currentMenu = ref<MenuResType>();

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentMenu.value = undefined;
  showModal();
};

const onEdit = (menu: MenuResType) => {
  currentMenu.value = menu;
  showModal();
};

const searchValue = ref<string>('');

const { data, isLoading } = useMenus();

const dataSource: ComputedRef<MenuResType[]> = computed(() =>
  listToTree(
    data?.value?.data
      ?.filter((i) => i?.name?.toUpperCase().includes(searchValue.value?.toUpperCase()))
      .map((i) => {
        return {
          ...i,
          label: i?.name,
          value: i?.id,
          key: i?.id,
        };
      }) || [],
  ),
);

const onSearch = (value: string) => {
  searchValue.value = value;
};

const { mutate: deleteMenu } = useDeleteMenu();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteMenu([id], {
      onSuccess(data) {
        handleSuccess(data, 'Xóa chức năng thành công!');
        queryClient.invalidateQueries({ queryKey: [MENUS_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const cancel = (e: MouseEvent) => {
  console.log(e);
};

const columns = [
  {
    title: 'Tên chức năng',
    dataIndex: 'name',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
];
</script>
