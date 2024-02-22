<template>
  <div class="py-4">
    <a-descriptions
      :labelStyle="{
        fontSize: '12px',
        fontWeight: '500',
        color: 'white',
      }"
      :contentStyle="{
        fontSize: '12px',
        fontWeight: '500',
        color: 'white',
      }"
      :column="1"
      class="mt-1"
      title="Thông tin Đối tượng"
    >
      <a-descriptions-item label="Huyện">
        {{ feature?.properties?.district }}
      </a-descriptions-item>
      <a-descriptions-item label="Xã">
        {{ feature?.properties?.commune }}
      </a-descriptions-item>
      <a-descriptions-item label="Vị trí">
        {{ feature?.properties?.latitude }},
        {{ feature?.properties?.longitude }}
      </a-descriptions-item>
      <a-descriptions-item label="Thời gian">
        {{ feature?.properties?.time_period }}
      </a-descriptions-item>
      <a-descriptions-item label="Diện tích">
        {{ feature?.properties?.area }}
      </a-descriptions-item>
      <a-descriptions-item label="Location on image">
        {{ feature?.properties?.location_on_image }}
      </a-descriptions-item>
    </a-descriptions>
    <a-button
      type="primary"
      size="small"
      @click="onDownloadFile"
    >
      Tải xuống thông tin
      <template #icon>
        <DownloadOutlined />
      </template>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import type { Feature } from '@/services/apis/map';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { downloadAIDetectObject } from '@/services/apis/layer';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { displayDateFormat } from '@/utils/constants';

const props = defineProps<{
  feature: Feature;
}>();

const onDownloadFile = async () => {
  try {
    const data = await downloadAIDetectObject(props?.feature?.id);
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data)], {
        type: 'application/json',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Báo_cáo_kết_quả_${dayjs().format(displayDateFormat)}`);
    document.body.appendChild(link);
    link.click();
  } catch (e) {
    notification.error({
      message: 'Thông báo',
      description: 'Đã xảy ra lỗi!',
    });
  }
};
</script>
