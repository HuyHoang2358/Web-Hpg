<template>
  <div class="flex flex-col items-center">
    <a-typography-text class="text-[8px] font-normal pb-0.5 text-white">
      {{ period }}
    </a-typography-text>
    <IconPoint v-if="period" />
    <IconPointInactive v-else />
  </div>
</template>
<script setup lang="ts">
import IconPoint from '@/components/icons/home/IconPoint.vue';
import IconPointInactive from '@/components/icons/home/IconPointInactive.vue';

defineProps<{
  period?: string;
}>();
</script>
