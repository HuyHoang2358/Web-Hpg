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
        name="roleName"
        label="Tên vai trò"
        :rules="[{ required: true, message: 'Vui lòng nhập tên vai trò' }]"
      >
        <a-input
          v-model:value="formState.roleName"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="roleId"
        label="ID vai trò"
        :rules="[{ required: true, message: 'Vui lòng nhập tên ID vai trò' }]"
        v-if="!isEdit"
      >
        <a-input
          v-model:value="formState.roleId"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="parentId"
        label="Vai trò"
      >
        <a-select
          v-model:value="formState.parentId"
          :options="[{ label: 'Không có lĩnh vực cha', value: null }]"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item
        name="appId"
        label="Chọn ứng dụng"
        :rules="[{ required: true, message: 'Vui chọn ứng dụng' }]"
      >
        <a-select
          v-model:value="formState.appId"
          :options="apps"
          :allow-clear="true"
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
import { notification } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { ROLE_QUERY_KEY, useCreateRole, useEditRole, useSysApp } from '@/services/hooks/useSystem';
import type { CreateRoleBody, RoleResType } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentRole?: RoleResType;
}>();

const isEdit = computed(() => Boolean(props.currentRole));
const getTitle = computed(() => (isEdit.value ? 'Cập nhật vai trò' : 'Thêm mới vai trò'));

const formRef = ref<FormInstance>();

const formState = reactive<CreateRoleBody>({
  parentId: null,
  roleName: '',
  roleId: '',
  appId: '',
  menuInRole: [],
  rightInRole: [],
  userInRole: [],
});

watch(
  () => props.open,
  () => {
    formState.parentId = null;
    formState.roleName = props.currentRole?.roleName || '';
    formState.roleId = props.currentRole?.roleId || '';
    formState.appId = props.currentRole?.appId || '';
  },
);
const { mutate: addNewRole, isPending: isCreating } = useCreateRole();
const { mutate: editRole, isPending: isEditing } = useEditRole();

const { data: resSysApp } = useSysApp();

const apps = computed(
  () =>
    resSysApp?.value?.data?.map((e) => {
      return { label: e.appName, value: e.appId };
    }) || [],
);

const queryClient = useQueryClient();

const { onError } = useErrorHandler();

const handleFinish = (values: CreateRoleBody) => {
  if (isEdit.value) {
    editRole(
      {
        ...values,
      },
      {
        onSuccess() {
          props.close();
          notification.success({
            message: 'Thành công',
            description: 'Sửa vai trò thành công!',
          });
          queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
        },
        onError,
      },
    );
  } else {
    addNewRole(values, {
      onSuccess() {
        props.close();
        notification.success({
          message: 'Thành công',
          description: 'Thêm vai trò thành công!',
        });
        queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
      },
      onError,
    });
  }
};
</script>
