import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Viewer } from 'cesium';

export const useViewerStore = defineStore('viewer', () => {
  const viewer = ref<Viewer>();

  return {
    viewer,
  };
});
