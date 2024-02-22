<template>
  <h1 class="text-3xl mb-1">{{ t('admin.users.userList') }}</h1>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    :pagination="pagination"
    row-class-name="cursor-pointer"
    @change="handleTableChange"
    :customRow="handleCustomRow"
    data-test="table"
  >
    <template #title>
      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-x-2.5">
          <a-input
            :placeholder="t('search')"
            v-model:value="searchValue"
            data-test="search-input"
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
            {{ t('add') }}
          </a-button>
          <a-upload
            :file-list="[]"
            name="file"
            :before-upload="
              () => {
                return false;
              }
            "
            :accept="excelMineType"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined />
              {{ t('import') }}
            </a-button>
          </a-upload>
        </div>
        <a-button
          @click="onDownload"
          id="export-excel"
        >
          <DownloadOutlined />
          {{ t('export') }}
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'roleUnitsList'">
        <span>
          <a-tag
            v-for="tag in record.roleUnitsList"
            :key="tag.roleId"
            :color="'#D0002D'"
          >
            {{ tag?.roleName?.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row gap-x-4">
          <a-dropdown trigger="click">
            <a-button
              ghost
              class="group"
            >
              <MoreOutlined
                :data-test="`more-outline-${index}`"
                class="text-gray-700 group-hover:text-main"
              />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  key="update"
                  @click="onEdit(record)"
                >
                  {{ t('admin.users.update') }}
                </a-menu-item>
                <a-menu-item
                  key="resetPassword"
                  @click="confirmResetPassword(record.name, record.userId)"
                  id="reset-password"
                >
                  {{ t('admin.users.resetPassword') }}
                </a-menu-item>
                <a-menu-item
                  key="delete"
                  @click="confirmDelete(record.name, record.userId)"
                  id="delete-user"
                >
                  {{ t('admin.users.delete') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleUser
    :open="modalHandleUserOpen"
    :close="() => (modalHandleUserOpen = false)"
    :current-user="currentUser"
  />
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, h, computed, createVNode, toRaw } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandleUser from '@/components/admin/ModalHandleUser.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import {
  UploadOutlined,
  DownloadOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import {
  useAdministrative,
  useChangePasswordByAdmin,
  useDeleteUser,
  useDownloadUserList,
  useInsertUserFromExcel,
  usePositions,
  useRoles,
  USERS_QUERY_KEY,
  useSysUnit,
  useUsers,
} from '@/services/hooks/useSystem';
import type { User } from '@/services/apis/systemApi';
import type { TablePaginationConfig, TableProps, UploadChangeParam } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import {
  defaultPage,
  defaultPageSize,
  defaultPassword,
  displayDateFormat,
  excelMineType,
} from '@/utils/constants';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import dayjs from 'dayjs';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const currentUser = ref<User>();
const currentPage = ref(route.query.p ? Number(route.query.p) : defaultPage);
const pageSize = ref(route.query.size ? Number(route.query.size) : defaultPageSize);
const searchValue = ref<string>('');
const units = ref<string[]>();
const address = ref<string[]>();
const positions = ref<string[]>();
const roles = ref<string[]>();
const direction = ref<string>('');
const sort = ref<string>('');
const modalHandleUserOpen = ref<boolean>(false);

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const queryClient = useQueryClient();
const { mutate: deleteUser } = useDeleteUser();
const { mutate: changePasswordByAdmin } = useChangePasswordByAdmin();
const { mutate: downloadUserList } = useDownloadUserList();
const { mutate: insertUserList } = useInsertUserFromExcel();
const { data: rolesData } = useRoles();
const { data: administrativeData } = useAdministrative();
const { data, isLoading } = useUsers({
  currentPage,
  pageSize,
  searchValue,
  units,
  positions,
  sort,
  direction,
  roles,
  address,
});

const dataSource: ComputedRef<User[]> = computed(() => data?.value?.data?.items || []);

const showModal = () => {
  modalHandleUserOpen.value = true;
};

const onAdd = () => {
  currentUser.value = undefined;
  showModal();
};

const onEdit = (user: User) => {
  currentUser.value = user;
  showModal();
};

const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);
  insertUserList(formData, {
    onError,
    onSuccess(data) {
      handleSuccess(data, t('admin.users.importUserSuccessfully'));
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

const handleCustomRow = (record: User) => {
  return {
    onClick: () => {
      console.log('record', toRaw(record));
      console.log('test 2');
    }, // click row
  };
};

const onDownload = () => {
  downloadUserList(undefined, {
    onError,
    onSuccess(data) {
      const url = URL.createObjectURL(
        new Blob([data], {
          type: excelMineType,
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sách_người_dùng_${dayjs().format(displayDateFormat)}`);
      document.body.appendChild(link);
      link.click();
    },
  });
};

const pagination = computed(() => ({
  total: data?.value?.data?.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
}));

const confirmResetPassword = (name: string, id: string) => {
  Modal.confirm({
    title: `Thông báo`,
    icon: createVNode(ExclamationCircleOutlined),
    content: `Xác nhận đặt lại mât khẩu của ${name}?`,
    onOk: async () => {
      return new Promise((resolve) => {
        changePasswordByAdmin(
          {
            userId: id,
            newPassword: defaultPassword,
          },
          {
            onSuccess(data) {
              handleSuccess(data, 'Đặt lại mật khẩu thành công!');
              resolve(true);
            },
            onError(error) {
              onError(error);
              resolve(true);
            },
          },
        );
      });
    },
    centered: true,
  });
};

const confirmDelete = (name: string, id: string) => {
  Modal.confirm({
    title: `Thông báo`,
    icon: createVNode(ExclamationCircleOutlined),
    content: `Xác nhận xóa tài khoản ${name}?`,
    onOk: async () => {
      return new Promise((resolve) => {
        deleteUser(id, {
          onSuccess(data) {
            handleSuccess(data, 'Xóa người dùng thành công!');
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
            resolve(true);
          },
          onError(error) {
            onError(error);
            resolve(true);
          },
        });
      });
    },
    centered: true,
  });
};

const { data: unitsData } = useSysUnit();
const { data: positionsData } = usePositions();

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('fullName'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('accountName'),
    dataIndex: 'userId',
    sorter: true,
  },
  {
    title: t('email'),
    dataIndex: 'email',
    sorter: true,
  },
  {
    title: t('phoneNumber'),
    dataIndex: 'phone',
    sorter: true,
  },
  {
    title: t('address'),
    dataIndex: 'address',
    filters:
      administrativeData?.value?.data
        ?.filter((i) => !i.parentId)
        ?.map((i) => {
          return {
            text: i.name,
            value: i.id,
          };
        }) || [],
  },
  {
    title: t('title'),
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
    title: t('unit'),
    dataIndex: 'unitName',
    filters:
      unitsData?.value?.data
        ?.filter((i) => !i.parentId)
        .map((i) => {
          return {
            text: i.unitName,
            value: i.id,
          };
        }) || [],
  },
  {
    title: t('role'),
    dataIndex: 'roleUnitsList',
    filters:
      rolesData?.value?.data?.map((i) => {
        return {
          text: i.roleId,
          value: i.roleId,
        };
      }) || [],
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any,
) => {
  currentPage.value = pag.current || defaultPage;
  units.value = filters?.unitName;
  positions.value = filters?.positionName;
  roles.value = filters?.roleUnitsList;
  address.value = filters?.address;
  sort.value = sorter.field;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';

  if (pageSize.value !== pag.pageSize) {
    pageSize.value = pag.pageSize || defaultPage;
    router.replace({
      query: {
        ...route.query,
        p: defaultPage,
        size: pag.pageSize,
      },
    });
    return;
  }

  router.replace({
    query: {
      ...route.query,
      p: pag.current?.toString(),
    },
  });
};
</script>
