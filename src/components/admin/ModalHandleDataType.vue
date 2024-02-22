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
        label="Loại dữ liệu"
        :rules="[{ required: true, message: 'Vui lòng nhập loại dữ liệu' }]"
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
        <a-textarea
          v-model:value="formState.description"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item>
        <div class="flex flex-row justify-end gap-x-4">
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
import { useQueryClient } from '@tanstack/vue-query';
import {
  DATA_TYPES_QUERY_KEY,
  useCreateDataType,
  useUpdateDataType,
} from '@/services/hooks/useSystem';
import type { CreateDataTypeBody, DataResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentDataType?: DataResType;
}>();

const isEdit = computed(() => Boolean(props.currentDataType));
const getTitle = computed(() => (isEdit.value ? 'Cập nhật loại dữ liệu' : 'Thêm mới loại dữ liệu'));

const formRef = ref<FormInstance>();

const formState = reactive<CreateDataTypeBody>({
  name: '',
  description: '',
});

watch(
  () => props.open,
  () => {
    formState.name = props.currentDataType?.name || '';
    formState.description = props.currentDataType?.description || '';
  },
);

const { mutate: createDataType, isPending: isCreating } = useCreateDataType();
const { mutate: updateDataType, isPending: isEditing } = useUpdateDataType();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreateDataTypeBody) => {
  if (isEdit.value) {
    updateDataType(
      {
        ...values,
        id: props.currentDataType?.id || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật loại dữ liệu thành công!');
          queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    createDataType(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm loại dữ liệu thành công!');
        queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
