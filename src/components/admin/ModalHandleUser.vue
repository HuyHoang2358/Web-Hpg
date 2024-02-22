<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item
        name="userId"
        :label="t('accountName')"
        :rules="[
          {
            required: true,
            message: 'Vui lòng nhập tên tài khoản',
          },
        ]"
      >
        <a-input
          v-model:value="formState.userId"
          :allow-clear="true"
          :maxlength="100"
        />
      </a-form-item>

      <a-form-item
        label="Mật khẩu"
        v-if="!isEdit"
      >
        <a-input-password
          value="123456aA@"
          readonly
        />
      </a-form-item>

      <a-form-item
        name="email"
        label="Email"
        :rules="[{ type: 'email', message: 'Email không đúng định dạng' }]"
      >
        <a-input
          :allow-clear="true"
          v-model:value="formState.email"
          :maxlength="100"
        />
      </a-form-item>

      <a-form-item
        label="Số điện thoại"
        name="phone"
        :rules="[
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại',
          },
        ]"
      >
        <a-input
          v-model:value="formState.phone"
          class="w-full"
          :allow-clear="true"
          :maxlength="12"
        />
      </a-form-item>

      <a-form-item
        name="positionId"
        label="Chức danh"
        :rules="[
          {
            required: true,
            message: 'Vui lòng nhập số chức danh',
          },
        ]"
      >
        <a-select
          v-model:value="formState.positionId"
          :options="positionOptions"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item
        name="unitId"
        label="Đơn vị"
        :rules="[
          {
            required: true,
            message: 'Vui lòng nhập đơn vị',
          },
        ]"
      >
        <a-tree-select
          v-model:value="formState.unitId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          allow-clear
          tree-default-expand-all
          :tree-data="unitOptions"
          tree-node-filter-prop="label"
        />
      </a-form-item>

      <a-form-item
        name="parentId"
        label="Vai trò"
      >
        <a-select
          :options="roleOptions"
          :allow-clear="true"
        />
      </a-form-item>

      <a-form-item>
        <div class="flex flex-row justify-end gap-x-6">
          <a-button @click="close">Hủy bỏ</a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isCreating || isUpdating"
          >
            Xác nhận
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import {
  useAddNewUser,
  usePositions,
  useRoles,
  USERS_QUERY_KEY,
  useSysUnit,
  useUpdateUser,
} from '@/services/hooks/useSystem';
import type { User } from '@/services/apis/systemApi';
import { watch } from 'vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { listToTree } from '@/DTP/common';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  open: boolean;
  close: () => void;
  currentUser?: User;
}>();

const { t } = useI18n();
const { data: units } = useSysUnit();
const { data: positions } = usePositions();
const { data: rolesData } = useRoles();

const unitOptions = computed(() =>
  listToTree(
    units?.value?.data?.map((i) => {
      return {
        ...i,
        label: i.unitName,
        value: i.id,
      };
    }) || [],
  ),
);

const positionOptions = computed(
  () =>
    positions?.value?.data?.map((i) => {
      return {
        label: i.name,
        value: i.id,
      };
    }) || [],
);

const roleOptions = computed(
  () =>
    rolesData?.value?.data?.map((i) => {
      return {
        text: i.roleId,
        value: i.roleId,
      };
    }) || [],
);

const isEdit = computed(() => Boolean(props.currentUser));
const title = computed(() => (isEdit.value ? 'Cập nhật người dùng' : 'Thêm mới người dùng'));

watch(
  () => props.open,
  () => {
    formState.userId = props.currentUser?.userId || '';
    formState.email = props.currentUser?.email || '';
    formState.phone = props.currentUser?.phone || '';
    formState.positionId = props.currentUser?.positionId || '';
    formState.unitId = props.currentUser?.unitId || '';
    formState.administrativeAddressId = props.currentUser?.addressId || '';
  },
);

interface FormState {
  userId: string;
  email?: string;
  phone?: string;
  positionId?: string;
  unitId?: string;
  administrativeAddressId?: string;
}

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  userId: '',
  email: '',
  phone: undefined,
});

const { mutate: addNewUser, isPending: isCreating } = useAddNewUser();
const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const handleFinish = (values: FormState) => {
  if (isEdit.value) {
    updateUser(
      {
        ...values,
        userId: props.currentUser?.userId || '',
      },
      {
        onSuccess(data) {
          props.close();
          handleSuccess(data, 'Cập nhật người dùng thành công!');
          queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
        onError,
      },
    );
    return;
  }

  addNewUser(values, {
    onSuccess(data) {
      props.close();
      handleSuccess(data, 'Thêm người dùng thành công!');
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError,
  });
};
</script>
