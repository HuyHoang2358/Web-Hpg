<template>
  <div
    class="w-full flex flex-row justify-between items-center bg-[#1C1C1C] bg-opacity-50 pl-5 pr-2 h-10"
  >
    <div class="flex items-center">
      <a-button
        @click="onBack"
        type="ghost"
        v-if="showBackButton"
        class="-ml-5 group"
      >
        <IconBack class="group-hover:text-[#EE0033]" />
      </a-button>
      <a-typography-text class="text-white font-medium text-xs 2xl:text-sm uppercase">
        {{ title }}
      </a-typography-text>
    </div>
    <a-button
      @click="onClose"
      type="ghost"
      class="group"
      v-if="onClose"
    >
      <IconCloseReport class="text-[#9D9D9D] group-hover:text-main" />
    </a-button>
  </div>
  <a-divider class="h-px bg-[#373737] m-0 p-0" />
</template>
<script setup lang="ts">
import IconCloseReport from '@/components/icons/IconCloseReport.vue';
import { h } from 'vue';
import IconBack from '@/components/icons/IconBack.vue';

defineProps<{
  onClose?: () => void;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}>();
</script>
