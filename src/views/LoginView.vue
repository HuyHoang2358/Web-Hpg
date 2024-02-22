<template>
  <a-config-provider
    :locale="viVN"
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <div class="flex h-screen w-screen dark-form">
      <a-row class="w-full">
        <a-col
          :span="12"
          class="background-img"
        >
          <div
            class="flex flex-col h-full w-full bg-[#151515] bg-opacity-60 relative justify-between left-container"
          >
            <img
              src="/images/auth/logo-viettel.png"
              alt="logo-viettel"
              class="logo"
            />
            <div>
              <a-typography-text class="text-[#F4F4F4] font-medium text-[49px]">
                Welcome
              </a-typography-text>
              <br />
              <a-typography-text class="text-[#F4F4F4] text-[25px] font-medium">
                Nền tảng quản lý và giám sát không gian V-Space
              </a-typography-text>
            </div>
            <div class="logo" />
          </div>
        </a-col>
        <a-col
          :span="12"
          class="bg-[#151515] flex flex-col justify-center items-center"
        >
          <a-typography-text class="text-[#D8D8D8] text-[40px] font-medium mb-20 font-magistral">
            Đăng nhập
          </a-typography-text>
          <a-form
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            layout="vertical"
            data-test="form"
          >
            <a-form-item
              label="Tài khoản"
              name="username"
              :rules="[{ required: true, message: 'Vui lòng nhập tài khoản!' }]"
            >
              <a-input
                v-model:value="formState.username"
                class="h-12 text-white text-xl"
                data-test="username"
              />
            </a-form-item>

            <a-form-item
              name="password"
              class="mb-2"
              label="Mật khẩu"
              :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
            >
              <a-input-password
                type="password"
                v-model:value="formState.password"
                class="h-12 text-white text-xl"
                data-test="password"
              >
                <template #iconRender="v">
                  <IconEyeOff v-if="v" />
                  <IconEye v-else />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item class="mb-0 w-full text-right">
              <a
                @click="warning"
                class="text-[#D8D8D8] hover:text-white w-full"
                id="forgot-password"
              >
                Quên mật khẩu?
              </a>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                class="w-full h-12 text-xl mt-8"
                :loading="isLoading"
              >
                Đăng nhập
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeOff from '@/components/icons/IconEyeOff.vue';
import { useLogin } from '@/services/hooks/useAuth';
import router from '@/router';
import { HOME_PAGE_PATH } from '@/utils/routePath';
import { LOCAL_STORAGE_KEY } from '@/utils/enums';
import { useConfigStore } from '@/stores/config';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { Modal, theme } from 'ant-design-vue';

interface LoginFormState {
  username: string;
  password: string;
}

const formState = reactive<LoginFormState>({
  username: '',
  password: '',
});

const { mutate, isPending: isLoading } = useLogin();

const configStore = useConfigStore();

const { onError } = useErrorHandler();

const onFinish = (values: LoginFormState) => {
  const body = {
    identity: values.username,
    password: values.password,
  };
  mutate(body, {
    onSuccess: (data) => {
      const token = data?.data?.accessToken;
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEY.USER_INFO, JSON.stringify(data?.data));
      configStore.setAccessToken(token);
      configStore.setUserInfo(data?.data);
      router.replace(HOME_PAGE_PATH);
    },
    onError,
  });
};

const warning = () => {
  Modal.warning({
    title: 'Vui lòng liên hệ admin để thay đổi mật khẩu',
    content: '',
  });
};
</script>

<style scoped>
.ant-form label {
  font-size: 20px;
}

.background-img {
  background-image: url('/images/auth/login-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.logo {
  width: 138px;
  height: 54px;
}

.left-container {
  padding-left: 87px;
  padding-top: 54px;
}
</style>
