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
          <h1 class="text-3xl mb-1">Danh sách lĩnh vực</h1>
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
            title="Xác nhận xóa lĩnh vực?"
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
  <ModalHandleField
    :close="() => (open = false)"
    :open="open"
    :current-field="currentField"
  />
</template>
<script lang="ts" setup>
import { SYS_FIELDS_QUERY_KEY, useDeleteField, useFields } from '@/services/hooks/useSystem';
import { computed, h, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import type { FieldResType } from '@/services/apis/systemApi';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandleField from '@/components/admin/ModalHandleField.vue';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';

const searchValue = ref<string>('');
const direction = ref<string>('');
const sort = ref<string>('');

const { data, isLoading, refetch } = useFields({
  searchValue,
  direction,
  sort,
});

watch(searchValue, () => {
  refetch();
});

const open = ref<boolean>(false);
const currentField = ref<FieldResType>();
const { mutate: deleteField } = useDeleteField();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<FieldResType[]> = computed(() => data?.value?.data || []);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentField.value = undefined;
  showModal();
};

const onEdit = (menu: FieldResType) => {
  currentField.value = menu;
  showModal();
};

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'Tên lĩnh vực',
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
        handleSuccess(data, 'Xóa lĩnh vực thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_FIELDS_QUERY_KEY] });
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
