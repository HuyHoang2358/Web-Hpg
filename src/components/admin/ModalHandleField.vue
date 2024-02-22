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
        label="Tên lĩnh vực"
        :rules="[{ required: true, message: 'Vui lòng nhập tên lĩnh vực' }]"
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
import { SYS_FIELDS_QUERY_KEY, useCreateField, useUpdateField } from '@/services/hooks/useSystem';
import type { CreateFieldBody, FieldResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentField?: FieldResType;
}>();

const isEdit = computed(() => Boolean(props.currentField));
const getTitle = computed(() => (isEdit.value ? 'Cập nhật lĩnh vực' : 'Thêm mới lĩnh vực'));

const formRef = ref<FormInstance>();

const formState = reactive<CreateFieldBody>({
  name: '',
  description: '',
});

watch(
  () => props.open,
  () => {
    formState.name = props.currentField?.name || '';
    formState.description = props.currentField?.description || '';
  },
);
const { mutate: createField, isPending: isCreating } = useCreateField();
const { mutate: updateField, isPending: isEditing } = useUpdateField();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreateFieldBody) => {
  if (isEdit.value) {
    updateField(
      {
        ...values,
        id: props.currentField?.id || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật lĩnh vực thành công!');
          queryClient.invalidateQueries({ queryKey: [SYS_FIELDS_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    createField(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm lĩnh vực thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_FIELDS_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
