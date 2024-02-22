<template>
  <div class="flex flex-1 flex-col justify-center items-center">
    <IconEmpty />
    <a-typography-text class="text-[#686868] font-medium text-[8px] mt-2.5">
      {{ emptyText || t('noData') }}
    </a-typography-text>
  </div>
</template>
<script setup lang="ts">
import IconEmpty from '@/components/icons/home/IconEmpty.vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  emptyText?: string;
}>();

const { t } = useI18n();
</script>
