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
        name="rightName"
        label="Tên quyền"
        :rules="[{ required: true, message: 'Vui lòng nhập tên quyền' }]"
      >
        <a-input
          v-model:value="formState.rightName"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="rightId"
        label="Mã quyền người dùng"
        :rules="[{ required: true, message: 'Vui lòng nhập mã của quyền' }]"
      >
        <a-input
          v-model:value="formState.rightId"
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
import { SYS_RIGHTS_QUERY_KEY, useCreateRight, useUpdateRight } from '@/services/hooks/useSystem';
import type { CreateRightBody, RightResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentRight?: RightResType;
}>();

const isEdit = computed(() => Boolean(props.currentRight));
const getTitle = computed(() =>
  isEdit.value ? 'Cập nhật quyền người dùng' : 'Thêm mới quyền người dùng',
);

const formRef = ref<FormInstance>();

const formState = reactive<CreateRightBody>({
  rightId: '',
  rightName: '',
});

watch(
  () => props.open,
  () => {
    formState.rightId = props.currentRight?.rightId || '';
    formState.rightName = props.currentRight?.rightName || '';
  },
);
const { mutate: createRight, isPending: isCreating } = useCreateRight();
const { mutate: editRight, isPending: isEditing } = useUpdateRight();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreateRightBody) => {
  if (isEdit.value) {
    editRight(
      {
        ...values,
        id: props.currentRight?.rightId || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật quyền thành công!');
          queryClient.invalidateQueries({ queryKey: [SYS_RIGHTS_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    createRight(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm quyền thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_RIGHTS_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
