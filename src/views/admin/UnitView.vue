<template>
  <h1 class="text-3xl mb-1">Danh sách các đơn vị</h1>

  <a-row :gutter="24">
    <a-col :span="8">
      <a-table
        :columns="unitsColumns"
        :data-source="unitsDataSource"
        :loading="isLoading"
        size="middle"
        row-class-name="cursor-pointer"
        default-expand-all-rows
        :row-selection="rowSelection"
      >
        <template #title>
          <a-row justify="end">
            <div class="flex flex-row gap-x-2.5">
              <a-upload
                :file-list="[]"
                name="file"
                :before-upload="
                  () => {
                    return false;
                  }
                "
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                @change="handleChange"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  Upload file
                </a-button>
              </a-upload>
              <a-button
                type="primary"
                class="flex justify-center items-center space-x-2.5"
                @click="onAdd"
              >
                Thêm mới
              </a-button>
            </div>
          </a-row>
        </template>
        <template #customFilterDropdown="{ confirm }">
          <div style="padding: 8px">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="unitsSearchValue"
              style="width: 188px; margin-bottom: 8px; display: block"
              ref="searchInput"
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="confirm()"
              @pressEnter="confirm()"
            >
              <template #icon><SearchOutlined /></template>
              Tìm kiếm
            </a-button>
            <a-button
              size="small"
              style="width: 90px"
              @click="unitsSearchValue = ''"
            >
              Đặt lại
            </a-button>
          </div>
        </template>
        <template #customFilterIcon="{ filtered }">
          <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
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
                :title="`Xác nhận xóa đơn vị ${record.unitName || ''}?`"
                @confirm="confirmDeleteUnit(record)"
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
    </a-col>
    <a-col :span="16">
      <a-table
        :columns="usersColumns"
        :data-source="dataSource"
        :loading="isLoadingUsersInUnitData"
        size="middle"
        :pagination="pagination"
        row-class-name="cursor-pointer"
        @change="handleTableChange"
      >
        <template #title>
          <a-row jutify="center">
            <a-col :span="14">
              <h1 class="text-2xl m-0">Danh sách người dùng</h1>
            </a-col>
            <a-col :span="10">
              <div class="flex flex-row gap-x-2.5">
                <a-input
                  placeholder="Tìm kiếm"
                  v-model:value="usersSearchValue"
                >
                  <template #prefix>
                    <IconSearchInput />
                  </template>
                </a-input>
                <a-button @click="null">
                  <DownloadOutlined />
                  Tải về
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
            <div class="flex flex-row gap-x-4">
              <a-popconfirm
                :title="`Xác nhận xóa ${record.name || 'người dùng'} khỏi đơn vị?`"
                @confirm="onDeleteUserInUnit(record.userId)"
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
    </a-col>
  </a-row>

  <ModalHandleUnit
    :open="open"
    :close="() => (open = false)"
    :currentUnit="currentUnit"
    :data-tree-select="optionsTree"
  />
</template>
<script lang="ts" setup>
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { ref, h, computed, watch } from 'vue';
import type { ComputedRef } from 'vue';
import {
  SYS_UNITS_QUERY_KEY,
  useDeleteUnit,
  useDeleteUserInUnit,
  useInsertUnitFromExcel,
  usePositions,
  USERS_IN_UNIT_QUERY_KEY,
  useSysUnit,
  useUsersInUnit,
} from '@/services/hooks/useSystem';
import type { UnitResType } from '@/services/apis/systemApi';
import { useQueryClient } from '@tanstack/vue-query';
import { listToTree } from '@/DTP/common';
import ModalHandleUnit from '@/components/admin/ModalHandleUnit.vue';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { defaultPage, defaultPageSize } from '@/utils/constants';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { User } from '@/services/apis/systemApi';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const open = ref<boolean>(false);
const currentUnit = ref<UnitResType>();
const unitsSearchValue = ref<string>('');
const usersSearchValue = ref<string>('');
const queryClient = useQueryClient();
const { mutate: deleteUnit } = useDeleteUnit();
const { mutate: deleteUserInUnit } = useDeleteUserInUnit();
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { data, isLoading } = useSysUnit();
const selectedRowKeysRef = ref<string[]>([]);
const currentPage = ref<number>(defaultPage);
const pageSize = ref<number>(defaultPageSize);
const positions = ref<string[]>();
const direction = ref<string>('');
const sort = ref<string>('');
const { data: positionsData } = usePositions();
const { mutate: insertUnitList } = useInsertUnitFromExcel();

const {
  data: usersInUnitData,
  isLoading: isLoadingUsersInUnitData,
  refetch: fetchUsersInUnit,
} = useUsersInUnit({
  unitIds: selectedRowKeysRef,
  pageSize,
  currentPage,
  positions,
  sort,
  direction,
  searchValue: usersSearchValue,
});

watch(usersSearchValue, () => {
  fetchUsersInUnit();
});

const dataSource: ComputedRef<User[]> = computed(() => usersInUnitData?.value?.data?.items || []);

const pagination = computed(() => ({
  total: usersInUnitData?.value?.data?.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
}));

const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: string[]) => {
    selectedRowKeysRef.value = selectedRowKeys;
    fetchUsersInUnit();
  },
});

const showModal = () => {
  open.value = true;
};
const onEdit = (unit: UnitResType) => {
  currentUnit.value = unit;
  showModal();
};

const onAdd = () => {
  currentUnit.value = undefined;
  showModal();
};

const unitsDataSource: ComputedRef<UnitResType[]> = computed(() =>
  listToTree(
    data?.value?.data
      ?.filter((i) => i?.unitName?.toUpperCase().includes(unitsSearchValue.value?.toUpperCase()))
      .map((i) => {
        return {
          ...i,
          label: i?.unitName,
          value: i?.id,
          key: i?.id,
        };
      }) || [],
  ),
);

const optionsTree = computed(() =>
  listToTree(
    data?.value?.data.map((i) => {
      return {
        ...i,
        label: i?.unitName,
        value: i?.id,
        key: i?.id,
      };
    }) || [],
  ),
);

const confirmDeleteUnit = async (unit: UnitResType) => {
  return new Promise((resolve) => {
    deleteUnit(unit?.id || '', {
      onSuccess(data) {
        handleSuccess(data, 'Xóa đơn vị thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_UNITS_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const onDeleteUserInUnit = async (id: string) => {
  return new Promise((resolve) => {
    deleteUserInUnit(id || '', {
      onSuccess(data) {
        handleSuccess(data, 'Xóa người dùng trong đơn vị thành công!');
        queryClient.invalidateQueries({ queryKey: [USERS_IN_UNIT_QUERY_KEY] });
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
  currentPage.value = pag.current || defaultPage;
  positions.value = filters?.positionName;
  sort.value = sorter.field;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';

  if (pageSize.value !== pag.pageSize) {
    pageSize.value = pag.pageSize || defaultPage;
    fetchUsersInUnit();
    return;
  }

  fetchUsersInUnit();
};

const cancel = (e: MouseEvent) => {
  console.log(e);
};

const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);
  insertUnitList(formData, {
    onError,
    onSuccess(data) {
      handleSuccess(data, 'Thêm đơn vị từ file thành công!');
      queryClient.invalidateQueries({ queryKey: [SYS_UNITS_QUERY_KEY] });
    },
  });
};

const searchInput = ref();

const unitsColumns = [
  {
    title: 'Tên đơn vị',
    dataIndex: 'unitName',
    customFilterDropdown: true,
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
];

const usersColumns = computed(() => [
  {
    title: 'STT',
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    sorter: true,
  },
  {
    title: 'Chức danh',
    dataIndex: 'positionName',
    filters:
      positionsData?.value?.data?.map((i) => {
        return {
          text: i.name,
          value: i.id,
        };
      }) || [],
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
]);
</script>
