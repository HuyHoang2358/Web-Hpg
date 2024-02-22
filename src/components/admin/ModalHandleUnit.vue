<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    style="width: 600px"
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
        name="unitName"
        label="Tên đơn vị"
        :rules="[{ required: true, message: 'Vui lòng nhập tên đơn vị' }]"
      >
        <a-input
          v-model:value="formState.unitName"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item
        name="unitCode"
        label="Mã đơn vị"
        :rules="[{ required: true }]"
        v-if="!isEdit"
      >
        <a-input
          v-model:value="formState.unitCode"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item
        name="parentUnitId"
        label="Đơn vị cấp trên"
      >
        <a-tree-select
          v-model:value="formState.parentUnitId"
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
        <div class="flex flex-row justify-end gap-x-4">
          <a-button @click="close">Hủy bỏ</a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isLoading"
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
import { SYS_UNITS_QUERY_KEY, useAddNewUnit, useEditUnit } from '@/services/hooks/useSystem';
import type { UnitResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentUnit?: UnitResType;
  dataTreeSelect: TreeSelectProps['treeData'];
}>();

const isEdit = computed(() => Boolean(props.currentUnit));
const getTitle = computed(() => (isEdit.value ? 'Cập nhật đơn vị' : 'Thêm mới đơn vị'));

const formRef = ref<FormInstance>();
const formState = reactive<UnitResType>({
  parentUnitId: null,
  unitCode: '',
  unitName: '',
  id: undefined,
});

watch(
  () => props.open,
  () => {
    formState.parentUnitId = props.currentUnit?.parentId || null;
    formState.unitCode = props.currentUnit?.unitCode || '';
    formState.unitName = props.currentUnit?.unitName || '';
    formState.id = props.currentUnit?.id || '';
  },
);
const { mutate: addNewUnit, isPending: isLoading } = useAddNewUnit();
const { mutate: editUnit } = useEditUnit();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const handleFinish = (values: UnitResType) => {
  if (isEdit.value) {
    editUnit(
      {
        ...values,
        id: props.currentUnit?.id,
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Sửa đơn vị thành công!');
          queryClient.invalidateQueries({ queryKey: [SYS_UNITS_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    addNewUnit(values, {
      onSuccess(data) {
        props.close();
        handleSuccess(data, 'Thêm đơn vị thành công!');
        queryClient.invalidateQueries({ queryKey: [SYS_UNITS_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
