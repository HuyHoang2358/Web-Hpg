<template>
  <a-modal
    :open="props.open"
    :title="null"
    @ok="handleOk"
    style="width: 655px"
    @cancel="props.close"
    :mask-closable="false"
    wrap-class-name="dark-form"
  >
    <template #closeIcon>
      <IconCloseModalGrey />
    </template>
    <div class="text-center">
      <label class="text-white text-sm font-medium uppercase font-magistral">{{ title }}</label>
    </div>
    <a-divider class="h-px bg-[#353535] mt-3 mb-1.5" />
    <a-typography-text class="text-white text-sm pb-4">Thông tin bản đồ</a-typography-text>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-form-item
            label="Lĩnh vực"
            name="field"
            :rules="[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]"
          >
            <a-select
              v-model:value="formState.field"
              placeholder="Chọn"
              :options="listFields"
            >
              <template #suffixIcon>
                <IconCustomDropdown />
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
            name="name"
            label="Tên bản đồ"
            :rules="[{ required: true, message: 'Vui lòng nhập tên bản đồ' }]"
          >
            <a-input
              v-model:value="formState.name"
              :allow-clear="true"
              placeholder="Nhập tên"
            />
          </a-form-item>
          <a-form-item
            label="Dịch vụ web"
            name="webService"
            :rules="[{ required: true, message: 'Vui lòng chọn dịch vụ web' }]"
          >
            <a-select
              v-model:value="formState.webService"
              placeholder="Chọn"
              :options="webServiceOptions"
            >
              <template #suffixIcon>
                <IconCustomDropdown />
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
            label="Loại dữ liệu"
            name="dataType"
            :rules="[{ required: true, message: 'Vui lòng chọn loại dữ liệu' }]"
          >
            <a-select
              v-model:value="formState.dataType"
              placeholder="Chọn"
              :options="dataOptions"
            >
              <template #suffixIcon>
                <IconCustomDropdown />
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
            label="Chia sẻ"
            name="share"
          >
            <a-select
              v-model:value="formState.share"
              placeholder="Chọn"
              :options="shareOptions"
            >
              <template #suffixIcon>
                <IconCustomDropdown />
              </template>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Đơn vị xây dựng bản đồ"
            name="unit"
            :rules="[{ required: true, message: 'Vui lòng nhập đơn vị xây dựng bản đồ' }]"
          >
            <a-input
              v-model:value="formState.unit"
              :allow-clear="true"
              placeholder="Nhập đơn vị xây dựng"
            />
          </a-form-item>
          <a-form-item
            label="Nguồn cung cấp"
            name="resources"
            :rules="[{ required: true, message: 'Vui lòng nhập nguồn cung cấp' }]"
          >
            <a-input
              v-model:value="formState.resources"
              :allow-clear="true"
              placeholder="Nhập nguồn cung cấp"
            />
          </a-form-item>
          <a-form-item
            label="Mô tả"
            name="description"
          >
            <a-input
              v-model:value="formState.description"
              :allow-clear="true"
              placeholder="Nhập mô tả"
            />
          </a-form-item>
          <a-form-item
            label="Thời gian lập bản đồ"
            name="createDate"
          >
            <a-date-picker
              class="w-full"
              placeholder="Chọn"
              :format="displayDateFormat"
              v-model:value="formState.createDate"
            >
              <template #suffixIcon>
                <IconDatePicker />
              </template>
            </a-date-picker>
          </a-form-item>
          <a-form-item
            label="Hiệu lực bản đồ"
            name="expire"
            :rules="[{ required: true, message: 'Vui lòng chọn thời gian lập bản đồ' }]"
          >
            <a-range-picker
              v-model:value="formState.expire"
              :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
              :format="displayDateFormat"
            >
              <template #suffixIcon>
                <IconDatePicker />
              </template>
            </a-range-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <label
        class="font-medium text-sm text-white"
        v-if="!isEdit"
      >
        <span class="text-[#ff4d4f]">*</span>
        File lớp bản đồ
      </label>
      <a-form-item
        name="files"
        class="mt-3"
        :rules="[
          {
            type: 'array',
            required: true,
            message: 'Vui lòng tải lên file.',
            trigger: 'change',
            min: 1,
          },
        ]"
        v-if="!isEdit"
      >
        <a-upload-dragger
          v-model:fileList="formState.files"
          name="upload"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @change="handleChange"
          :multiple="true"
        >
          <template #removeIcon>
            <IconTrash class="text-main" />
          </template>
          <div class="flex flex-row items-center justify-center">
            <IconUploadForm />
            <a-typography-text class="text-white text-sm font-normal ml-2">
              Tải file
            </a-typography-text>
          </div>
          <a-typography-text class="text-[#BEBEBE] font-normal text-xs">
            File SHP
            <span class="text-main">*</span>
            , SHX
            <span class="text-main">*</span>
            , DBF
            <span class="text-main">*</span>
            , PRJ
            <span class="text-main">*</span>
            , XML
          </a-typography-text>
        </a-upload-dragger>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        @click="close"
        class="bg-[#393939] border-[#393939] text-[#A9A9A9] font-medium text-xs"
      >
        Hủy bỏ
      </a-button>
      <a-button
        type="primary"
        @click="onSubmit"
        class="text-white font-medium text-xs"
        :loading="isLoadingCreate || isLoadingUpdate"
      >
        {{ !isEdit ? 'Thêm mới' : 'Cập nhật' }}
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import type { UnwrapRef } from 'vue';
import { computed, reactive, ref, watch } from 'vue';
import IconCloseModalGrey from '@/components/icons/IconCloseModalGrey.vue';
import {
  bodyDateFormat,
  dataOptions,
  displayDateFormat,
  responseDateFormat,
  shareOptions,
  webServiceOptions,
} from '@/utils/constants';
import IconDatePicker from '@/components/icons/IconDatePicker.vue';
import IconCustomDropdown from '@/components/icons/IconCustomDropdown.vue';
import IconUploadForm from '@/components/icons/IconUploadForm.vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import IconTrash from '@/components/icons/home/IconTrashNormal.vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  LAYERS_BY_GROUP_QUERY_KEY,
  LAYERS_QUERY_KEY,
  SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY,
  useAddNewLayer,
  useCategoriesInUnit,
  useUpdateLayer,
} from '@/services/hooks/useLayer';
import { FILE_TYPE, GROUP_LAYER_TYPE } from '@/utils/enums';
import { useQueryClient } from '@tanstack/vue-query';
import type { LayerDetailResType } from '@/services/apis/layer';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

const { data: fields } = useCategoriesInUnit(GROUP_LAYER_TYPE.CHUYEN_NGANH);

const listFields = computed(() => {
  return (
    fields?.value?.data.map((e) => {
      return { label: e.name, value: e.id };
    }) || []
  );
});

const props = defineProps<{
  open: boolean;
  close: () => void;
  layerDetail?: LayerDetailResType;
}>();

const handleOk = (e: MouseEvent) => {
  console.log(e);
};

interface FormState {
  field?: string;
  name?: string;
  webService?: string;
  dataType: string;
  share: string;
  unit?: string;
  resources?: string;
  description?: string;
  createDate?: Dayjs;
  expire: Dayjs[];
  files?: any[];
}

const formRef = ref();

const isEdit = computed(() => !!props?.layerDetail);

const title = computed(() => (props?.layerDetail ? 'Cập nhật lớp bản đồ' : 'Thêm mới lớp bản đồ'));

watch(
  () => props.open,
  () => {
    formState.field = props?.layerDetail?.category_id;
    formState.name = props?.layerDetail?.name;
    formState.webService = props?.layerDetail?.type;
    formState.share = props?.layerDetail?.sharing || 'public';
    formState.resources = props?.layerDetail?.source_provider;
    formState.unit = props?.layerDetail?.layer_provider;
    formState.description = props?.layerDetail?.description;
    formState.createDate = props?.layerDetail?.time_create_layer
      ? dayjs(props?.layerDetail.time_create_layer, responseDateFormat)
      : undefined;
    formState.expire =
      props?.layerDetail?.temporal_extent_end && props?.layerDetail?.temporal_extent_start
        ? [
            dayjs(props?.layerDetail?.temporal_extent_start, responseDateFormat),
            dayjs(props?.layerDetail?.temporal_extent_end, responseDateFormat),
          ]
        : [];
  },
);

const formState: UnwrapRef<FormState> = reactive({
  share: 'public',
  expire: [],
  dataType: 'vector',
});

const checkValid = (fileType = '') =>
  fileType === FILE_TYPE.SHP ||
  fileType === FILE_TYPE.SHX ||
  fileType === FILE_TYPE.DBF ||
  fileType === FILE_TYPE.PRJ ||
  fileType === FILE_TYPE.XML;

const getType = (file: string) => file.slice(-4);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file) {
    return;
  }
  const fileType = getType(file.name);

  if (!checkValid(fileType)) {
    message.error('Vui lòng tải lên File SHP, SHX, DBF, PRJ, XML!');
    return false;
  }
  return true;
};

const customRequest = () => {};

const handleChange = (info: UploadChangeParam<any>) => {
  const uniqueTypes: Record<string, UploadFile> = {};
  info.fileList
    ?.filter((item) => checkValid(getType(item.name)))
    ?.map((item) => {
      return {
        ...item,
        status: 'done',
        percent: 100,
      };
    })
    .filter(function (item) {
      uniqueTypes[getType(item.name)] = item;
      return true;
    });
  formState.files = Object.values(uniqueTypes);
};

const { mutate: create, isPending: isLoadingCreate } = useAddNewLayer();
const { mutate: update, isPending: isLoadingUpdate } = useUpdateLayer();

const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const onSubmit = () => {
  formRef.value.validate().then(() => {
    // console.log('values', toRaw(formState));
    if (isEdit.value) {
      update(
        {
          id: props?.layerDetail?.id || '',
          category_id: formState?.field,
          description: formState?.description,
          layer_provider: formState?.unit,
          layer_type: formState?.dataType,
          name: formState?.name,
          service_type: formState?.webService,
          source_provider: formState?.resources,
          temporal_extent_end: formState.expire[1].format(bodyDateFormat),
          temporal_extent_start: formState.expire[0].format(bodyDateFormat),
          time_create_layer: formState.createDate
            ? formState.createDate?.format(bodyDateFormat)
            : null,
          sharing: formState?.share,
        },
        {
          onError,
          onSuccess: (data) => {
            props.close();
            handleSuccess(data, 'Cập nhật lớp bản đồ thành công!');
            queryClient.invalidateQueries({ queryKey: [SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [LAYERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [LAYERS_BY_GROUP_QUERY_KEY] });
          },
        },
      );

      return;
    }
    const formData = new FormData();
    const dbfFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.DBF,
    )?.originFileObj;
    const prjFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.PRJ,
    )?.originFileObj;
    const shpFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.SHP,
    )?.originFileObj;
    const shxFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.SHX,
    )?.originFileObj;
    const xmlFile = formState.files?.find(
      (item) => getType(item.name) === FILE_TYPE.XML,
    )?.originFileObj;
    dbfFile && formData.append('dbfFile', dbfFile);
    prjFile && formData.append('prjFile', prjFile);
    shpFile && formData.append('shpFile', shpFile);
    shxFile && formData.append('shxFile', shxFile);
    xmlFile && formData.append('xmlFile', xmlFile);

    const layerInfo = {
      is_layer_local: true,
      linh_vuc_id: formState.field,
      ten_lop: formState.name,
      dich_vu_web_ogc: formState.webService,
      loai_du_lieu: formState.dataType,
      sharing: formState.share,
      don_vi_xay_dung_ban_do: formState.unit,
      nguon_cung_cap: formState.resources,
      mo_ta: formState.description,
      thoi_gian_tao_ban_do: formState.createDate
        ? formState.createDate?.format(bodyDateFormat)
        : null,
      hieu_luc_ban_do_start: formState.expire[0].format(bodyDateFormat),
      hieu_luc_ban_do_end: formState.expire[1].format(bodyDateFormat),
    };

    formData.append('layerInfo', JSON.stringify(layerInfo));
    create(formData, {
      onError,
      onSuccess: (data) => {
        props.close();
        handleSuccess(data, 'Thêm mới lớp bản đồ thành công');
        queryClient.invalidateQueries({ queryKey: [SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [LAYERS_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [LAYERS_BY_GROUP_QUERY_KEY] });
      },
    });
  });
};
</script>
