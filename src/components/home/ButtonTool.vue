<template>
  <a-tooltip placement="right">
    <template #title>
      <span class="px-4">{{ title }}</span>
    </template>
    <a-button
      class="bg-transparent border-0 rounded-none h-8 2xl:h-10 flex justify-center items-center group"
      @click="handleClick"
      style="width: 40px"
      :disabled="disabled"
    >
      <template #icon>
        <slot />
      </template>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import type { ICON_TOOL_ACTIVE } from '@/utils/enums';

const props = defineProps<{
  title?: string;
  disabled?: boolean;
  onClick: (name: ICON_TOOL_ACTIVE) => void;
  name: ICON_TOOL_ACTIVE;
}>();

const handleClick = () => {
  props.onClick(props.name);
};
</script>
