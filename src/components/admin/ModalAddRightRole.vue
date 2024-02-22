<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    style="width: 1000px"
    title="Các quyền của vai trò"
    @cancel="props.close"
    ok-text="Gán quyền"
    cancel-text="Hủy bỏ"
    @ok="onOke"
    :confirm-loading="isLoadingConfirm"
  >
    <a-table
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :loading="isLoading"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import type { RightInRole } from '@/services/apis/systemApi';
import { reactive, watch } from 'vue';
import { ROLE_QUERY_KEY, useAddRightToRole, useSysRight } from '@/services/hooks/useSystem';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { RightResType } from '@/services/apis/systemApi';
import { notification } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  rightInRole?: RightInRole[];
  roleId?: string;
}>();

type Key = string;

const { data, isLoading } = useSysRight();

const dataSource: ComputedRef<RightResType[]> = computed(
  () =>
    data?.value?.data.map((i) => {
      return {
        ...i,
        key: i.rightId,
      };
    }) || [],
);

const columns = [
  {
    title: 'ID Quyền',
    dataIndex: 'rightId',
  },
  {
    title: 'Tên Quyền',
    dataIndex: 'rightName',
  },
];

const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

watch(
  () => props.open,
  () => {
    state.selectedRowKeys = props?.rightInRole?.map((i) => i.rightId) || [];
  },
);

const { mutate, isPending: isLoadingConfirm } = useAddRightToRole();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();

const onOke = () => {
  mutate(
    {
      roleIdList: [props.roleId || ''],
      rightInRole: state.selectedRowKeys,
    },
    {
      onSuccess() {
        props.close();
        notification.success({
          message: 'Thành công',
          description: 'Gán quyền cho vai trò thành công!',
        });
        queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
      },
      onError,
    },
  );
};
</script>
