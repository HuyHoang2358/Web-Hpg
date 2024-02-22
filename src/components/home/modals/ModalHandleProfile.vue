<template>
  <a-modal
    :open="configStore.isOpenModalHandleProfile"
    :title="null"
    @cancel="configStore.setOpenModalHandleProfile(false)"
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
        Thông tin tài khoản
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
        label="Họ tên"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên"
          disabled
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
          disabled
        />
      </a-form-item>

      <a-form-item
        label="Số điện thoại"
        name="phone"
      >
        <a-input
          v-model:value="formState.phone"
          class="w-full"
          :allow-clear="true"
          :maxlength="12"
          disabled
        />
      </a-form-item>
      <a-form-item
        name="unitId"
        label="Đơn vị"
      >
        <a-select
          v-model:value="formState.unitId"
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
          v-model:value="formState.positionId"
          :options="positionOptions"
          :allow-clear="true"
          disabled
        />
      </a-form-item>
      <a-form-item>
        <div class="flex flex-row justify-end gap-x-6">
          <a-button
            type="primary"
            class="text-white font-medium text-xs"
            @click="handleFinish"
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
import { reactive, ref, computed } from 'vue';
import type { UnwrapRef } from 'vue';
import { useConfigStore } from '@/stores/config';
import { usePositions, useSysUnit } from '@/services/hooks/useSystem';
import type { UpdateUserBody } from '@/services/apis/systemApi';
import { useRouter } from 'vue-router';
import { ADMIN_UPDATE_PROFILE } from '@/utils/routePath';

const configStore = useConfigStore();

const formState: UnwrapRef<Omit<UpdateUserBody, 'userId'>> = reactive({
  name: configStore.profile?.name,
  positionId: configStore?.profile?.positionId,
  unitId: configStore?.profile?.unitId,
  email: configStore?.profile?.email,
  phone: configStore?.profile?.phone,
});

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

const formRef = ref();
const router = useRouter();

const handleFinish = () => {
  configStore.setOpenModalHandleProfile(false);
  router.push(ADMIN_UPDATE_PROFILE);
};
</script>
