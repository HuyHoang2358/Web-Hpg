<template>
  <a-modal
    :open="configStore.isOpenModalChangePassword"
    @cancel="onCancel"
    :mask-closable="false"
    centered
    wrap-class-name="dark-form"
    :title="null"
    :footer="null"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <div class="text-center">
      <label class="text-white text-sm font-medium uppercase font-magistral">
        Đổi mật khẩu tài khoản
      </label>
    </div>
    <a-divider class="h-px bg-[#353535] mt-3 mb-1.5" />
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="dark-form"
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
          <a-button @click="onCancel">Hủy bỏ</a-button>
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
  </a-modal>
</template>
<script lang="ts" setup>
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useChangePassword } from '@/services/hooks/useSystem';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { Rule } from 'ant-design-vue/es/form';

const configStore = useConfigStore();

interface FormState {
  currentPassword?: string;
  pass: string;
  checkPass: string;
}

const formState: UnwrapRef<FormState> = reactive({
  pass: '',
  checkPass: '',
});

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

const formRef = ref();

const { mutate: updatePassword, isPending: isUpdating } = useChangePassword();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onCancel = () => {
  configStore.setOpenModalChangePassword(false);
  formState.pass = '';
  formState.checkPass = '';
  formState.currentPassword = '';
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
          onCancel();
        },
        onError,
      },
    );
  });
};
</script>
