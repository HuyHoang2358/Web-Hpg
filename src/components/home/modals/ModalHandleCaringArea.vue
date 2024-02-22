<template>
  <a-modal
    :open="mapToolStore.isShowModalHandleCaringArea"
    :title="null"
    @cancel="mapToolStore.hideModalHandleCaringArea"
    :mask-closable="false"
    centered
    wrap-class-name="dark-form"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <div class="text-center">
      <label class="text-white text-sm font-medium uppercase font-magistral">
        {{
          mapToolStore.modalHandleCaringAreaMode === 'create'
            ? 'Thêm mới khu vực quan tâm'
            : 'Cập nhật thông tin'
        }}
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
        label="Tên khu vực quan tâm"
        :rules="[{ required: true, message: 'Vui lòng nhập tên khu vực quan tâm' }]"
      >
        <a-input
          v-model:value="formState.name"
          :allow-clear="true"
          placeholder="Nhập tên"
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
      <a-form-item
        label="Thời gian Giám sát"
        name="expire"
        :rules="[{ required: true, message: 'Vui lòng chọn thời gian giám sát' }]"
      >
        <a-range-picker
          v-model:value="formState.expire"
          :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
          :format="displayDateFormat"
          class="w-full"
        >
          <template #suffixIcon>
            <IconDatePicker />
          </template>
        </a-range-picker>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        type="primary"
        @click="onSubmit"
        class="text-white font-medium text-xs"
        :loading="isLoadingCreate || isLoadingEdit"
      >
        {{ mapToolStore.modalHandleCaringAreaMode === 'create' ? ' Thêm mới' : 'Cập nhật' }}
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import { useMapToolStore } from '@/stores/mapTool';
import type { UnwrapRef } from 'vue';
import { reactive, ref, watch } from 'vue';
import {
  CARING_AREA_QUERY_KEY,
  useCreateCaringArea,
  useEditCaringArea,
} from '@/services/hooks/useBookmark';
import { useQueryClient } from '@tanstack/vue-query';
import { bodyDateFormat, displayDateFormat } from '@/utils/constants';
import IconDatePicker from '@/components/icons/IconDatePicker.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import type { Attributes } from '@/services/apis/map';
import dayjs, { Dayjs } from 'dayjs';
import { useEntityStore } from '@/stores/entity';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const mapToolStore = useMapToolStore();
const entityStore = useEntityStore();

interface FormState {
  name?: string;
  description?: string;
  expire?: Dayjs[];
}

const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({});

watch(
  () => mapToolStore.isShowModalHandleCaringArea,
  () => {
    if (entityStore.polygonInfo) {
      const polygonInfo = entityStore.polygonInfo;
      formState.name = polygonInfo?.name;
      formState.description = polygonInfo?.description;
      formState.expire =
        polygonInfo?.start_valid_date && polygonInfo?.end_valid_date
          ? [
              dayjs(polygonInfo?.start_valid_date, 'DD-MM-YYYY'),
              dayjs(polygonInfo?.end_valid_date, 'DD-MM-YYYY'),
            ]
          : undefined;
      return;
    }
    formState.name = undefined;
    formState.description = undefined;
    formState.expire = undefined;
  },
);

const { mutate: handleCreate, isPending: isLoadingCreate } = useCreateCaringArea();
const { mutate: handleEdit, isPending: isLoadingEdit } = useEditCaringArea();

const close = () => {
  mapToolStore.hideModalHandleCaringArea();
  formState.name = '';
  formState.description = '';
  formState.expire = undefined;
};

const queryClient = useQueryClient();

const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

// const { turnOnDrawPolygon } = useDrawPolygon();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    const attributes: Partial<Attributes> = {
      name: formState.name,
      description: formState.description,
      start_valid_date: formState?.expire && formState?.expire[0]?.format(bodyDateFormat),
      end_valid_date: formState?.expire && formState?.expire[1]?.format(bodyDateFormat),
      // area: mapToolStore.dataModalHandleCaringArea?.area,
    };

    const formData = new FormData();
    formData.append('boundary', entityStore.regionSaveBody);
    formData.append('attributes', JSON.stringify(attributes));

    if (mapToolStore.modalHandleCaringAreaMode === 'create') {
      // if (!mapToolStore.dataModalHandleCaringArea?.boundary) {
      //   mapToolStore.setNeedToDrawPolygon(true);
      //   close();
      //   mapToolStore.setDataModalHandleCaringArea(attributes);
      //   mapToolStore.hideBottomHome();
      //   mapStore?.sideBySideMap?._resetSizeDelay();
      //   mapToolStore.changeActiveTool(ICON_TOOL_ACTIVE.POLYGON);
      //   // turnOnDrawPolygon(DRAW_TYPE.POLYGON);
      //   return;
      // }

      handleCreate(formData, {
        onSuccess: (data) => {
          handleSuccess(data, 'Tạo vùng quan tâm thành công!');
          entityStore.polygonInfo = data?.data;
          close();
          queryClient.invalidateQueries({ queryKey: [CARING_AREA_QUERY_KEY] });
        },
        onError,
      });
    } else {
      formData.append('id', entityStore.polygonInfo?.id || '');
      handleEdit(formData, {
        onSuccess: (data) => {
          handleSuccess(data, 'Cập nhật thành công!');
          entityStore.polygonInfo = data?.data;
          close();
          queryClient.invalidateQueries({ queryKey: [CARING_AREA_QUERY_KEY] });
        },
        onError,
      });
    }
  });
};
</script>
