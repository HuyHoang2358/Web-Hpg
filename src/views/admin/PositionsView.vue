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
          <h1 class="text-3xl mb-1">Danh sách chức danh</h1>
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
            title="Xác nhận xóa chức danh?"
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
  <ModalHandlePosition
    :close="() => (open = false)"
    :open="open"
    :current-position="currentPosition"
  />
</template>
<script lang="ts" setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { ref, h, computed, watch } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import { POSITIONS_QUERY_KEY, useDeletePosition, usePositions } from '@/services/hooks/useSystem';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { PositionResType } from '@/services/apis/systemApi';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import ModalHandlePosition from '@/components/admin/ModalHandlePosition.vue';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const open = ref<boolean>(false);

const currentPosition = ref<PositionResType>();

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentPosition.value = undefined;
  showModal();
};

const onEdit = (menu: PositionResType) => {
  currentPosition.value = menu;
  showModal();
};

const searchValue = ref<string>(route?.query?.searchValue?.toString() || '');

const { data, isLoading, refetch } = usePositions({ searchValue: searchValue });

const dataSource: ComputedRef<PositionResType[]> = computed(() => data?.value?.data || []);

watch(searchValue, () => {
  refetch();
  router.replace({
    query: {
      searchValue: searchValue.value || undefined,
    },
  });
});

const queryClient = useQueryClient();

const { mutate: deletePosition } = useDeletePosition();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deletePosition(id, {
      onSuccess(data) {
        handleSuccess(data, 'Xóa chức danh thành công');
        queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'Tên chức danh',
    dataIndex: 'name',
  },
  {
    title: 'Mã chức danh',
    dataIndex: 'code',
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
