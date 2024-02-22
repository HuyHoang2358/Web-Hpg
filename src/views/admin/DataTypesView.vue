<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    row-class-name="cursor-pointer"
    @change="handleTableChange"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="16">
          <h1 class="text-3xl mb-1">Danh sách loại dữ liệu</h1>
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
            title="Xác nhận loại dữ liệu?"
            @confirm="confirm(record.id)"
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
  <ModalHandleDataType
    :close="() => (open = false)"
    :open="open"
    :current-data-type="currentDataType"
  />
</template>
<script lang="ts" setup>
import { DATA_TYPES_QUERY_KEY, useDataTypes, useDeleteDataType } from '@/services/hooks/useSystem';
import { computed, h, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import type { DataResType } from '@/services/apis/systemApi';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import ModalHandleDataType from '@/components/admin/ModalHandleDataType.vue';

const searchValue = ref<string>('');
const direction = ref<string>('');
const sort = ref<string>('');

const { data, isLoading, refetch } = useDataTypes({
  searchValue,
  direction,
  sort,
});

watch(searchValue, () => {
  refetch();
});

const open = ref<boolean>(false);
const currentDataType = ref<DataResType>();
const { mutate: deleteField } = useDeleteDataType();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<DataResType[]> = computed(() => data?.value?.data || []);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentDataType.value = undefined;
  showModal();
};

const onEdit = (menu: DataResType) => {
  currentDataType.value = menu;
  showModal();
};

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'Tên loại dữ liệu',
    dataIndex: 'name',
    sorter: true,
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

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteField(id, {
      onSuccess(data) {
        handleSuccess(data, 'Xóa loại dữ liệu thành công!');
        queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any,
) => {
  sort.value = sorter.field;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
  refetch();
};
</script>
