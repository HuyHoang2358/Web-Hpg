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
        label="Tên đơn vị hành chính"
        :rules="[{ required: true, message: 'Vui lòng nhập tên đơn vị hành chính' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item
        name="parentId"
        label="Đơn vị hành chính cấp trên"
      >
        <a-select
          v-model:value="formState.parentId"
          show-search
          allow-clear
          :options="dataTreeSelect"
          :filter-option="filterOption"
        />
      </a-form-item>

      <a-form-item>
        <div class="flex flex-row justify-end gap-x-4">
          <a-button @click="close">Hủy bỏ</a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isLoadingAdd || isLoadingEdit"
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
import type { FormInstance, TreeSelectProps } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import {
  ADMINISTRATIVE_QUERY_KEY,
  useAddNewAdministrative,
  useEditAdministrative,
} from '@/services/hooks/useSystem';
import type { AdministrativeResType, CreateAdministrativeBody } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { filterOption } from '@/DTP/common';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentAdministrative?: AdministrativeResType;
  dataTreeSelect: TreeSelectProps['treeData'];
}>();

const isEdit = computed(() => Boolean(props.currentAdministrative));
const getTitle = computed(() =>
  isEdit.value ? 'Cập nhật đơn vị hành chính' : 'Thêm mới đơn vị hành chính',
);

const formRef = ref<FormInstance>();
const formState = reactive<CreateAdministrativeBody>({
  parentId: '',
  name: '',
});

watch(
  () => props.open,
  () => {
    formState.parentId = props.currentAdministrative?.parentId || null;
    formState.name = props.currentAdministrative?.name || '';
  },
);
const { mutate: create, isPending: isLoadingAdd } = useAddNewAdministrative();
const { mutate: edit, isPending: isLoadingEdit } = useEditAdministrative();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreateAdministrativeBody) => {
  if (isEdit.value) {
    edit(
      {
        ...values,
        id: props.currentAdministrative?.id || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật đơn vị hành chính thành công!');
          queryClient.invalidateQueries({ queryKey: [ADMINISTRATIVE_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    create(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm đơn vị hành chính thành công!');
        queryClient.invalidateQueries({ queryKey: [ADMINISTRATIVE_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
