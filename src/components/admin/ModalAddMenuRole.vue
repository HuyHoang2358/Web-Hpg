<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    style="width: 1000px"
    title="Các chức năng của vai trò"
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
import type { MenuInRole, MenuResType } from '@/services/apis/systemApi';
import { reactive, watch } from 'vue';
import { ROLE_QUERY_KEY, useAddMenuToRole, useMenus } from '@/services/hooks/useSystem';
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { listToTree } from '@/DTP/common';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  menuInRole?: MenuInRole[];
  roleId?: string;
}>();

type Key = string;
const { data, isLoading } = useMenus();
const { mutate, isPending: isLoadingConfirm } = useAddMenuToRole();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<MenuResType[]> = computed(() =>
  listToTree(
    data?.value?.data.map((i) => {
      return {
        ...i,
        key: i?.id,
      };
    }) || [],
  ),
);

const columns = [
  {
    title: 'Tên chức năng',
    dataIndex: 'name',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
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
    state.selectedRowKeys = props?.menuInRole?.map((i) => i.id) || [];
  },
);

const onOke = () => {
  mutate(
    {
      roleIdList: [props.roleId || ''],
      menuInRole: state.selectedRowKeys,
    },
    {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Gán chức năng cho vai trò thành công!');
        queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
      },
      onError,
    },
  );
};
</script>
