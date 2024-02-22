<template>
  <a-modal
    :open="configStore.isOpenModalSetting"
    :title="null"
    @cancel="configStore.setOpenModalSetting(false)"
    :mask-closable="false"
    centered
    wrap-class-name="dark-form"
    :footer="null"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <div class="text-center">
      <label class="text-white text-sm font-medium uppercase font-magistral">
        Cài đặt tài khoản
      </label>
    </div>
    <a-divider class="h-px bg-[#353535] mt-3 mb-1.5" />
    <a-form
      ref="formRef"
      :model="formState"
      class="dark-form"
      @finish="handleFinish"
    >
      <a-form-item label="Nhận thông báo">
        <a-switch v-model:checked="formState.notificationOn" />
      </a-form-item>
      <a-form-item>
        <div class="flex flex-row justify-end gap-x-6">
          <a-button
            type="primary"
            class="text-white font-medium text-xs"
            html-type="submit"
            :loading="isUpdating"
          >
            Cập nhật
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { reactive, ref } from 'vue';
import { useConfigStore } from '@/stores/config';
import { PROFILE_QUERY_KEY, useUpdateSetting } from '@/services/hooks/useSystem';
import type { SettingBody } from '@/services/apis/systemApi';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const configStore = useConfigStore();

const formState: SettingBody = reactive({
  notificationOn: configStore.profile?.notificationOn,
});

const formRef = ref();

const { mutate: updateSetting, isPending: isUpdating } = useUpdateSetting();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const queryClient = useQueryClient();

const handleFinish = (values: SettingBody) => {
  formRef.value.validate().then(() => {
    updateSetting(values, {
      onSuccess(data) {
        handleSuccess(data, 'Thay đổi cài đặt thành công!');
        queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
      },
      onError,
    });
  });
};
</script>
