import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ScreenSpaceEventHandler } from 'cesium';

export const useHandleStore = defineStore('handleStore', () => {
  // state define
  const handles = ref<ScreenSpaceEventHandler[]>([]);

  // action define
  return {
    handles,
  };
});
