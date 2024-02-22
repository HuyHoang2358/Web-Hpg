<template>
  <div class="flex flex-row">
    <div
      v-for="item in data"
      :key="item.id"
      class="relative mr-4 rounded-sm overflow-hidden group cursor-pointer"
    >
      <div class="img-size">
        <img
          :src="item.fullPathUrl"
          alt="satellite-photo"
          :class="[
            'border border-solid img img-size',
            globalStore.images.has(item.id) ? 'border-[#EE0033]' : 'border-[#6D6D6D]',
          ]"
          @click="globalStore.images.has(item.id) ? removeImage(item.id) : addImage(item)"
        />
      </div>

      <div class="group-hover:flex hidden absolute right-1 top-0">
        <a-button
          type="primary"
          size="small"
          @click="downloadImage(item.fullPathUrl, item.id)"
        >
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
      </div>
      <div
        class="absolute -bottom-0 right-1"
        v-if="globalStore.imageIds.includes(item.id)"
      >
        <IconTickSelectedImage />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconTickSelectedImage from '@/components/icons/IconTickSelectedImage.vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import type { ImagesInMapResType } from '@/services/apis/map';
import { addImage, removeImage } from '@/DTP_new/modules/image';
import { useGlobalStore } from '@/stores/globalStore';

// TODO: Define Props
type Props = {
  data?: ImagesInMapResType[];
};
defineProps<Props>();

// TODO: define global store
const globalStore = useGlobalStore();

// TODO: Download Image with public image url
const downloadImage = async (imageUrl: string, id: string) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${id}.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<style scoped>
.img-size {
  width: 102px;
  height: 72px;
  overflow: hidden;
}

.img {
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}

.img:hover {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
</style>
