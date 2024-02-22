<template>
  <a-modal
    :open="store.isShowModalHandleBookmark"
    :title="null"
    @cancel="store.hideModalHandleBookmark"
    :mask-closable="false"
    centered
    wrap-class-name="dark-form"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <div class="text-center">
      <label class="text-white text-sm font-medium uppercase font-magistral">
        {{ mode === 'create' ? 'Danh sách mới' : 'Cập nhật thông tin' }}
      </label>
    </div>
    <a-divider class="h-px bg-[#353535] mt-3 mb-1.5" />
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="dark-form"
    >
      <a-form-item
        name="name"
        label="Tên danh sách"
        :rules="[{ required: true, message: 'Vui lòng nhập tên danh sách' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        type="primary"
        @click="onSubmit"
        class="text-white font-medium text-xs"
        :loading="isLoadingEdit || isLoadingCreate"
      >
        {{ mode === 'create' ? ' Thêm mới' : 'Cập nhật' }}
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { reactive, ref, watch } from 'vue';
import type { UnwrapRef } from 'vue';
import {
  BOOKMARK_LIST_QUERY_KEY,
  useCreateBookmark,
  useEditBookmark,
} from '@/services/hooks/useBookmark';
import { useQueryClient } from '@tanstack/vue-query';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const store = useMapToolStore();

const mode = ref<'create' | 'edit'>('create');

watch(
  () => store.isShowModalHandleBookmark,
  () => {
    formState.name = store.dataModalHandleBookmark?.bookmarkName;
    mode.value = store.dataModalHandleBookmark ? 'edit' : 'create';
  },
);

interface FormState {
  name?: string;
}

const formRef = ref();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const formState: UnwrapRef<FormState> = reactive({});

const { mutate: handleEdit, isPending: isLoadingEdit } = useEditBookmark();
const { mutate: handleCreate, isPending: isLoadingCreate } = useCreateBookmark();

const close = () => {
  store.hideModalHandleBookmark();
  formState.name = '';
};

const onSubmit = () => {
  formRef.value.validate().then(() => {
    if (mode.value === 'edit') {
      handleEdit(
        {
          id: store.dataModalHandleBookmark?.id || '',
          bookmarkName: formState.name || '',
        },
        {
          onSuccess: (data) => {
            handleSuccess(data, 'Cập nhật thành công!');
            close();
            queryClient.invalidateQueries({ queryKey: [BOOKMARK_LIST_QUERY_KEY] });
          },
          onError,
        },
      );
    } else {
      handleCreate(
        {
          bookmarkName: formState.name || '',
        },
        {
          onSuccess: (data) => {
            handleSuccess(data, 'Tạo danh sách thành công!');
            close();
            queryClient.invalidateQueries({ queryKey: [BOOKMARK_LIST_QUERY_KEY] });
          },
          onError,
        },
      );
    }
  });
};
</script>
