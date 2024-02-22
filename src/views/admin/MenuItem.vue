<template>
  <a-menu-item
    :key="menuKey"
    :id="menuKey"
  >
    <div class="flex flex-row items-center">
      <slot />
      <router-link
        :to="path"
        class="ml-4 font-medium font-sarabun text-lg"
      >
        {{ title }}
      </router-link>
    </div>
  </a-menu-item>
</template>
<script setup lang="ts">
import { MENU_KEY } from '@/utils/enums';

defineProps<{
  menuKey: MENU_KEY;
  path: string;
  title: string;
}>();
</script>
