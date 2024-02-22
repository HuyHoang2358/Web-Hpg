<template>
  <div
    class="top-container relative flex flex-col justify-between overflow-hidden bg-[#151515] bg-opacity-90 pt-1"
  >
    <label class="text-xs font-normal text-[#BABABA] pl-6">{{ title }}</label>
    <div class="flex justify-around absolute bottom-0 w-full">
      <Point :period="period" />
    </div>
    <div class="flex">
      <Chain
        v-for="n in numsChain"
        :key="n"
      />
    </div>
  </div>

  <div class="h-0.5 w-full bg-transparent" />

  <div class="flex flex-1 justify-between items-center flex-row bg-[#151515] bg-opacity-90">
    <a-button type="ghost">
      <IconCarousel />
    </a-button>
    <custom-a-spin v-if="isLoading" />
    <custom-a-empty v-if="!isLoading && images?.length === 0" />
    <div
      v-else
      class="overflow-x-scroll"
    >
      <ListImage :data="images" />
    </div>

    <a-button type="ghost">
      <IconCarousel class="rotate-180" />
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListImage from '@/components/home/bottom/ListImage.vue';
import Point from '@/components/home/bottom/Point.vue';
import Chain from '@/components/home/bottom/Chain.vue';
import IconCarousel from '@/components/icons/home/IconCarousel.vue';
import type { ImagePreviewResponseModel } from '@/services/apis/layer';
import CustomAEmpty from '@/components/home/CustomAEmpty.vue';
import CustomASpin from '@/components/home/CustomASpin.vue';

defineProps<{
  title?: string;
  images?: ImagePreviewResponseModel[];
  isLoading?: boolean;
  period?: string;
}>();

const numsChain = ref(100);
</script>

<style scoped>
.top-container {
  height: 42px;
}
</style>
