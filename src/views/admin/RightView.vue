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
          <h1 class="text-3xl mb-1">Danh sách quyền của người dùng</h1>
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
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            title="Xác nhận xóa vai trò?"
            @confirm="confirm(record.rightId)"
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
  <ModalHandleRight
    :close="() => (open = false)"
    :open="open"
    :current-right="currentRight"
  />
</template>
<script lang="ts" setup>
import { SYS_RIGHTS_QUERY_KEY, useDeleteRight, useSysRight } from '@/services/hooks/useSystem';
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import type { RightResType } from '@/services/apis/systemApi';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import ModalHandleRight from '@/components/admin/ModalHandleRight.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const { data, isLoading } = useSysRight();
const searchValue = ref<string>('');
const open = ref<boolean>(false);
const currentRight = ref<RightResType>();
const { mutate: deleteRight } = useDeleteRight();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<RightResType[]> = computed(
  () =>
    data?.value?.data?.filter(
      (i) => i?.rightName?.toUpperCase().includes(searchValue.value?.toUpperCase()),
    ) || [],
);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentRight.value = undefined;
  showModal();
};

const onEdit = (menu: RightResType) => {
  currentRight.value = menu;
  showModal();
};

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'ID Quyền',
    dataIndex: 'rightId',
  },
  {
    title: 'Tên Quyền',
    dataIndex: 'rightName',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
];

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteRight(id, {
      onSuccess(data) {
        handleSuccess(data, 'Xóa quyền thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_RIGHTS_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};
</script>
