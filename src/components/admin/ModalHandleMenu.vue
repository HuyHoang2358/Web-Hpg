<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    style="width: 400px"
    :footer="false"
    :title="getTitle"
    @cancel="props.close"
  >
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        label="Tên chức năng"
        :rules="[{ required: true, message: 'Vui lòng nhập tên chức năng' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="description"
        label="Mô tả"
        :rules="[{ required: true, message: 'Vui lòng nhập mô tả' }]"
      >
        <a-input
          v-model:value="formState.description"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item
        name="parentId"
        label="Chọn nhóm chức năng"
      >
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          allow-clear
          tree-default-expand-all
          :tree-data="dataTreeSelect || []"
          tree-node-filter-prop="label"
        />
      </a-form-item>

      <a-form-item>
        <div class="flex flex-row justify-end gap-x-6">
          <a-button @click="close">Hủy bỏ</a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isCreating || isEditing"
          >
            {{ isEdit ? 'Cập nhât' : 'Thêm mới' }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { MENUS_QUERY_KEY, useAddNewMenu, useEditMenu } from '@/services/hooks/useSystem';
import type { CreateMenuBody, MenuResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentMenu?: MenuResType;
  dataTreeSelect?: TreeSelectProps['treeData'];
}>();

const isEdit = computed(() => Boolean(props.currentMenu));
const getTitle = computed(() => (isEdit.value ? 'Cập nhật menu' : 'Thêm mới menu'));

const formRef = ref<FormInstance>();

const formState = reactive<CreateMenuBody>({
  parentId: null,
  description: '',
  name: '',
});

watch(
  () => props.open,
  () => {
    console.log('props.currentMenu?.parentId ', props.currentMenu?.parentId);
    formState.parentId = props.currentMenu?.parentId || null;
    formState.description = props.currentMenu?.description || '';
    formState.name = props.currentMenu?.name || '';
  },
);
const { mutate: addNewMenu, isPending: isCreating } = useAddNewMenu();
const { mutate: editMenu, isPending: isEditing } = useEditMenu();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreateMenuBody) => {
  if (isEdit.value) {
    editMenu(
      {
        ...values,
        id: props.currentMenu?.id || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật chức năng thành công!');
          queryClient.invalidateQueries({ queryKey: [MENUS_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    addNewMenu(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm chức năng thành công!');
        queryClient.invalidateQueries({ queryKey: [MENUS_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
