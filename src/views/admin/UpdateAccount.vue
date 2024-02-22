<template>
  <a-row :gutter="[16, 32]">
    <a-col :span="12">
      <a-card title="Thông tin tài khoản">
        <a-form
          ref="formRefProfile"
          :model="formStateProfile"
          layout="vertical"
          @finish="handleFinishUpdateProfile"
        >
          <a-form-item
            name="name"
            label="Họ tên"
          >
            <a-input
              v-model:value="formStateProfile.name"
              :allow-clear="true"
              placeholder="Nhập tên"
            />
          </a-form-item>

          <a-form-item
            name="email"
            label="Email"
            :rules="[{ type: 'email', message: 'Email không đúng định dạng' }]"
          >
            <a-input
              :allow-clear="true"
              v-model:value="formStateProfile.email"
              :maxlength="100"
            />
          </a-form-item>

          <a-form-item
            label="Số điện thoại"
            name="phone"
          >
            <a-input
              v-model:value="formStateProfile.phone"
              class="w-full"
              :allow-clear="true"
              :maxlength="12"
            />
          </a-form-item>

          <a-form-item
            name="unitId"
            label="Đơn vị"
          >
            <a-select
              v-model:value="formStateProfile.unitId"
              :options="unitOptions"
              :allow-clear="true"
              disabled
            />
          </a-form-item>

          <a-form-item
            name="positionId"
            label="Chức danh"
          >
            <a-select
              v-model:value="formStateProfile.positionId"
              :options="positionOptions"
              :allow-clear="true"
              disabled
            />
          </a-form-item>

          <a-form-item>
            <div class="flex flex-row justify-end gap-x-4">
              <a-button @click="onCancelUpdateUser">Hủy bỏ</a-button>
              <a-button
                type="primary"
                html-type="submit"
                :loading="isUpdating"
              >
                Xác nhận
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card title=" Đổi mật khẩu tài khoản">
        <a-form
          ref="formRef"
          :model="formState"
          layout="vertical"
          @finish="handleFinish"
          :rules="rules"
        >
          <a-form-item
            label="Mật khẩu hiện tại"
            name="currentPassword"
          >
            <a-input-password
              v-model:value="formState.currentPassword"
              autocomplete="off"
              :allow-clear="true"
            />
          </a-form-item>
          <a-form-item
            has-feedback
            label="Mật khẩu"
            name="pass"
          >
            <a-input-password
              v-model:value="formState.pass"
              autocomplete="off"
              :allow-clear="true"
            />
          </a-form-item>
          <a-form-item
            has-feedback
            label="Nhâp lại mật khẩu"
            name="checkPass"
          >
            <a-input-password
              v-model:value="formState.checkPass"
              autocomplete="off"
              :allow-clear="true"
            />
          </a-form-item>
          <a-form-item>
            <div class="flex flex-row justify-end gap-x-4">
              <a-button @click="onCancelUpdatePassword">Hủy bỏ</a-button>
              <a-button
                type="primary"
                html-type="submit"
                :loading="isUpdatingPassword"
              >
                Xác nhận
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import type { UnwrapRef } from 'vue';
import { useConfigStore } from '@/stores/config';
import {
  PROFILE_QUERY_KEY,
  useChangePassword,
  usePositions,
  useSysUnit,
  useUpdateUser,
} from '@/services/hooks/useSystem';
import type { UpdateUserBody } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { Rule } from 'ant-design-vue/es/form';

const configStore = useConfigStore();

const formStateProfile: UnwrapRef<Omit<UpdateUserBody, 'userId'>> = reactive({
  name: configStore.profile?.name,
  positionId: configStore?.profile?.positionId,
  unitId: configStore?.profile?.unitId,
  email: configStore?.profile?.email,
  phone: configStore?.profile?.phone,
});

watch(
  () => configStore.profile,
  () => {
    formStateProfile.name = configStore.profile?.name;
    formStateProfile.positionId = configStore.profile?.positionId;
    formStateProfile.unitId = configStore.profile?.unitId;
    formStateProfile.email = configStore.profile?.email;
    formStateProfile.phone = configStore.profile?.phone;
  },
);

interface FormState {
  currentPassword?: string;
  pass: string;
  checkPass: string;
}

const formState: UnwrapRef<FormState> = reactive({
  pass: '',
  checkPass: '',
});

const formRef = ref();

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Vui lòng nhập mật khẩu');
  } else {
    if (formState.checkPass !== '') {
      formRef?.value?.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Vui lòng nhập lại mật khẩu');
  } else if (value !== formState.pass) {
    return Promise.reject('Mật khẩu không trùng khớp!');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  currentPassword: [
    { required: true, trigger: 'change', message: 'Vui lòng nhập mật khẩu hiện tại' },
  ],
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
};

const { data: units } = useSysUnit();
const { data: positions } = usePositions();

const unitOptions = computed(
  () =>
    units?.value?.data?.map((i) => {
      return {
        label: i.unitName,
        value: i.id,
      };
    }) || [],
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

const formRefProfile = ref();

const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
const { onError } = useErrorHandler();
const queryClient = useQueryClient();
const { handleSuccess } = useSuccessHandler();

const handleFinishUpdateProfile = (values: Omit<UpdateUserBody, 'userId'>) => {
  formRefProfile.value.validate().then(() => {
    updateUser(
      {
        ...values,
        userId: configStore?.profile?.userId || '',
      },
      {
        onSuccess(data) {
          handleSuccess(data, 'Cập nhật thông tin tài khoản thành công!');
          queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
        },
        onError,
      },
    );
  });
};

const { mutate: updatePassword, isPending: isUpdatingPassword } = useChangePassword();

const onCancelUpdatePassword = () => {
  formRef.value.resetFields();
};

const onCancelUpdateUser = () => {
  formRefProfile.value.resetFields();
  formStateProfile.name = configStore.profile?.name;
  formStateProfile.positionId = configStore.profile?.positionId;
  formStateProfile.unitId = configStore.profile?.unitId;
  formStateProfile.email = configStore.profile?.email;
  formStateProfile.phone = configStore.profile?.phone;
};

const handleFinish = (values: FormState) => {
  formRef.value.validate().then(() => {
    updatePassword(
      {
        newPassword: values.pass,
        oldPassword: values.currentPassword || '',
      },
      {
        onSuccess(data) {
          handleSuccess(data, 'Thay đổi mật khẩu thành công!');
          onCancelUpdatePassword();
        },
        onError,
      },
    );
  });
};
</script>
