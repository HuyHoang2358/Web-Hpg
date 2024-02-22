<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    row-class-name="cursor-pointer"
  >
    <template #title>
      <div class="flex flex-row justify-between">
        <h1 class="text-3xl mb-1">Danh sách đơn vị hành chính</h1>
        <div>
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
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
              :icon="h(IconAddCircle)"
              @click="onAdd"
            >
              Thêm mới
            </a-button>
          </div>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            title="Xác nhận dữ liệu?"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
            />
          </a-popconfirm>
        </div>
      </template>
      <template v-if="column.dataIndex === 'active'">
        <a-checkbox
          :checked="record.isActive"
          @change="(e: CheckboxChangeEvent) => onChangeCheckBox(e, record.id)"
        />
      </template>
    </template>
  </a-table>
  <ModalHandleAdministrative
    :close="() => (open = false)"
    :open="open"
    :current-administrative="currentAdministrative"
    :data-tree-select="optionsTree"
  />
</template>
<script lang="ts" setup>
import {
  ADMINISTRATIVE_QUERY_KEY,
  useAdministrative,
  useDeleteAdministrative,
  useEditAdministrative,
  useInsertAdministrativeFromExcel,
} from '@/services/hooks/useSystem';
import { computed, h, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import type { AdministrativeResType } from '@/services/apis/systemApi';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { listToTree } from '@/DTP/common';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import ModalHandleAdministrative from '@/components/admin/ModalHandleAdministrative.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const searchValue = ref<string>('');
const open = ref<boolean>(false);
const currentAdministrative = ref<AdministrativeResType>();
const { mutate: deleteAdministrative } = useDeleteAdministrative();
const { data, isLoading, refetch } = useAdministrative({
  searchValue,
});
const { data: optionsData } = useAdministrative();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { mutate: insert } = useInsertAdministrativeFromExcel();

watch(searchValue, () => {
  refetch();
});

const dataSource: ComputedRef<AdministrativeResType[]> = computed(() => {
  let indexOfParent = 0;

  return listToTree(
    data?.value?.data.map((i) => {
      if (!i?.parentId) {
        indexOfParent++;
      }

      return {
        ...i,
        indexOfParent: !i?.parentId ? indexOfParent : undefined,
        label: i?.name,
        value: i?.id,
        key: i?.id,
      };
    }) || [],
  );
});

const optionsTree = computed(
  () =>
    optionsData?.value?.data
      ?.filter((i) => !i.parentId)
      .map((i) => {
        return {
          ...i,
          label: i?.name,
          value: i?.id,
          key: i?.id,
        };
      }) || [],
);

const { mutate: edit } = useEditAdministrative();

const onChangeCheckBox = (event: CheckboxChangeEvent, id: string) => {
  edit(
    {
      isActive: Boolean(event.target.checked),
      id,
    },
    {
      onSuccess(data) {
        handleSuccess(data, 'Cập nhật đơn vị hành chính thành công!');
        queryClient.invalidateQueries({ queryKey: [ADMINISTRATIVE_QUERY_KEY] });
      },
      onError,
    },
  );
};

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentAdministrative.value = undefined;
  showModal();
};

const onEdit = (menu: AdministrativeResType) => {
  currentAdministrative.value = menu;
  showModal();
};

const columns = [
  {
    title: 'STT',
    dataIndex: 'indexOfParent',
    width: 60,
  },
  {
    title: 'Tên Quận/Huyện',
    dataIndex: 'name',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
  {
    title: 'Hoạt động',
    dataIndex: 'active',
  },
];

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteAdministrative(id, {
      onSuccess(data) {
        handleSuccess(data, 'Xóa dữ liệu thành công!');
        queryClient.invalidateQueries({ queryKey: [ADMINISTRATIVE_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const handleChange = (info: UploadChangeParam<File>) => {
  const formData = new FormData();
  formData.append('file', info.file);
  insert(formData, {
    onError,
    onSuccess(data) {
      handleSuccess(data, 'Thêm đơn vị hành chính từ file thành công!');
      queryClient.invalidateQueries({ queryKey: [ADMINISTRATIVE_QUERY_KEY] });
    },
  });
};
</script>
