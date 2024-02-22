<template>
  <div class="flex items-center flex-row justify-between h-8 2xl:h-10 pl-4">
    <div class="flex flex-row items-center">
      <a-button
        :icon="h(IconBack)"
        @click="onBack"
        type="ghost"
        v-if="showBackButton"
      />
      <label
        :class="[
          'text-white font-medium text-xs 2xl:text-sm m-0 uppercase',
          showBackButton && 'pl-2',
        ]"
      >
        {{ title }}
      </label>
    </div>
    <a-button
      @click="onClose"
      type="ghost"
      class="group"
    >
      <IconCancel class="text-[#606060] group-hover:text-main" />
    </a-button>
  </div>
  <a-divider
    class="h-px bg-[#373737] m-0 p-0 -mt-px"
    v-if="!isNotShowDivider"
  />
</template>
<script setup lang="ts">
import IconCancel from '@/components/icons/IconCancel.vue';
import { h } from 'vue';
import IconBack from '@/components/icons/IconBack.vue';

defineProps<{
  onClose: () => void;
  title: string;
  isNotShowDivider?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}>();
</script>
