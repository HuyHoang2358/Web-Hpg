<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    style="width: 600px"
    title="Phân vai trò người dùng"
    @cancel="close"
    ok-text="Gán quyền"
    cancel-text="Hủy bỏ"
    @ok="onOke"
    :confirm-loading="isLoadingConfirm"
  >
    <a-table
      :pagination="false"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="dataSource"
      :loading="isLoadingRole"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { useAddRoleToPeople, useRoles, USERS_QUERY_KEY } from '@/services/hooks/useSystem';
import { computed, reactive, watch } from 'vue';
import type { ComputedRef, UnwrapRef } from 'vue';
import type { RoleResType, User } from '@/services/apis/systemApi';
import { notification } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { randomAllKey } from '@/utils/constants';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  close: () => void;
  open: boolean;
  currentUser?: User;
}>();

type Key = string | number;

const editableData: UnwrapRef<Record<string, string[]>> = reactive({});

const columns = [
  {
    title: 'Id vai trò',
    dataIndex: 'roleId',
  },
  {
    title: 'Tên vai trò',
    dataIndex: 'roleName',
  },
];

const { data: roles, isLoading: isLoadingRole } = useRoles();

const dataSource: ComputedRef<(RoleResType & { key: Key })[]> = computed(
  () =>
    roles?.value?.data?.map((i) => {
      return {
        ...i,
        key: i.roleId,
      };
    }) || [],
);

const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

watch(
  () => props.open,
  () => {
    state.selectedRowKeys =
      props.currentUser?.roleUnitsList?.map((i) => {
        return i.roleId;
      }) || [];
  },
);

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

const { mutate, isPending: isLoadingConfirm } = useAddRoleToPeople();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onOke = () => {
  if (state.selectedRowKeys.length === 0) {
    notification.info({
      message: 'Vui lòng chọn ít nhất 1 vai trò',
    });
    return;
  }

  const addUserRoleUnitDtoList = state.selectedRowKeys.map((i) => {
    return {
      roleId: i,
      unitIdList: editableData[i]?.filter((i) => i !== randomAllKey) || [],
    };
  });
  mutate(
    {
      userId: props?.currentUser?.userId || '',
      addUserRoleUnitDtoList,
    },
    {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Gán quyền người dùng thành công!');
        queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      },
      onError,
    },
  );
};
</script>
