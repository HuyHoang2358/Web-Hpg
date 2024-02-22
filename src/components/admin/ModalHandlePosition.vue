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
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="name"
        label="Tên chức danh"
        :rules="[{ required: true, message: 'Vui lòng nhập tên chức danh' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="code"
        label="Mã chức danh"
        :rules="[{ required: true, message: 'Vui lòng nhập mã chức danh' }]"
      >
        <a-input
          v-model:value="formState.code"
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
          placeholder="Nhập mô tả"
          style="height: 73px"
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
  POSITIONS_QUERY_KEY,
  useCreatePosition,
  useEditPosition,
} from '@/services/hooks/useSystem';
import type { CreatePositionBody, PositionResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentPosition?: PositionResType;
}>();

const isEdit = computed(() => Boolean(props.currentPosition));

const getTitle = computed(() => (isEdit.value ? 'Cập nhật chức danh' : 'Thêm mới chức danh'));

const formRef = ref<FormInstance>();

const formState = reactive<CreatePositionBody>({
  code: '',
  description: '',
  name: '',
});

watch(
  () => props.open,
  () => {
    formState.code = props.currentPosition?.code || '';
    formState.description = props.currentPosition?.description || '';
    formState.name = props.currentPosition?.name || '';
  },
);
const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
const { mutate: editPosition, isPending: isEditing } = useEditPosition();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: CreatePositionBody) => {
  if (isEdit.value) {
    editPosition(
      { ...values, id: props.currentPosition?.id || '' },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật chức danh thành công!');
          queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    createPosition(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm chức danh thành công!');
        queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
