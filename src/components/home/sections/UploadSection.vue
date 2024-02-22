<template>
  <div
    class="flex flex-col container-section bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90"
  >
    <HeaderSection
      :on-close="() => mapToolStore.changeActiveTool()"
      title="FIlE POLYGON"
    />

    <div class="px-4 py-3.5">
      <h2 class="text-white text-sm">Thông tin file polygon</h2>
    </div>

    <div class="flex ml-4">
      <div class="bg-[#D0002D] px-2 py-1 rounded-tr-sm rounded-tl-sm">
        <a-typography-text class="text-white text-xs">File GeoJson</a-typography-text>
      </div>
    </div>
    <a-form
      ref="formRef"
      :model="formState"
      class="flex flex-col px-4"
    >
      <a-form-item
        name="files"
        :rules="[
          {
            type: 'array',
            required: true,
            message: `Vui lòng tải lên file`,
            min: 1,
          },
        ]"
      >
        <a-upload-dragger
          v-model:fileList="formState.files"
          name="upload"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @change="handleChange"
          :max-count="1"
        >
          <template #removeIcon>
            <IconTrash class="text-[#BBBBBB]" />
          </template>
          <div class="flex flex-row items-center justify-center py-11">
            <IconUploadForm />
            <a-typography-text class="text-white text-sm font-normal ml-2">
              Tải hoặc kéo thả file .geojson
            </a-typography-text>
          </div>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item>
        <a-row justify="end">
          <a-button
            @click="onCancel"
            class="bg-[#393939] border-[#393939] text-[#A9A9A9] font-medium text-xs mr-2"
          >
            Hủy bỏ
          </a-button>
          <a-button
            type="primary"
            @click="onSubmit"
            class="text-white font-medium text-xs"
          >
            Thêm mới
          </a-button>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapRef } from 'vue';
import { reactive, ref } from 'vue';
import { useMapToolStore } from '@/stores/mapTool';
import IconUploadForm from '@/components/icons/IconUploadForm.vue';
import IconTrash from '@/components/icons/home/IconTrashNormal.vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import HeaderSection from '@/components/home/sections/HeaderSection.vue';
import type { GeoJsonFile } from '@/DTP/DTP.type';

const mapToolStore = useMapToolStore();

interface FormState {
  files?: any[];
}

const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({});

const customRequest = () => {};

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file) {
    return;
  }

  if (file.name.slice(-8) !== '.geojson') {
    message.error(`Vui lòng tải lên file .geojson!`);
    return false;
  }
  return true;
};

const onCancel = () => {
  formState.files = [];
  mapToolStore.changeActiveTool();
};

const geoJsonContent = ref<GeoJsonFile>();
const handleChange = (info: UploadChangeParam<any>) => {
  formState.files = info.fileList
    ?.filter((item) => item.name.slice(-8) === '.geojson')
    .map((item) => {
      return {
        ...item,
        status: 'done',
        percent: 100,
      };
    });
  if (formState.files.length > 0) {
    const geoFile = formState.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      geoJsonContent.value = JSON.parse(event?.target?.result);
    };
    reader.readAsText(geoFile.originFileObj);
  }
};

// const { onClickPoint, completeDrawPolygonHandle } = useDrawPolygon();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    if (!geoJsonContent.value) {
      return;
    }

    // geoJsonContent.value.features.forEach((f) => {
    //   const polygonIndex = mapStore.polygonIndex + 1;
    //
    //   const latLngs = f.geometry.coordinates[0];
    //
    //   if (
    //     latLngs[0][0] === latLngs[latLngs.length - 1][0] &&
    //     latLngs[0][1] === latLngs[latLngs.length - 1][1]
    //   ) {
    //     latLngs.pop();
    //   }
    //
    //   if (latLngs.length <= 2) {
    //     return;
    //   }
    //
    //   const points = latLngs.map(([lng, lat], _index) => {
    //     const entity = drawPoint({ lat, lng });
    //     entity.getElement()?.addEventListener('click', () => onClickPoint(polygonIndex, _index));
    //     return {
    //       lat,
    //       lng,
    //       entity,
    //     };
    //   });
    //
    //   mapStore.addPolygon({
    //     points,
    //     polygon: drawPolygon(points),
    //     status: POLYGON_STATUS.COMPLETE,
    //   });
    //
    //   completeDrawPolygonHandle(polygonIndex);
    //
    //   formState.files = [];
    // });
  });
};
</script>
