import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Entity, Viewer } from 'cesium';
import type { ClickSceneMode, SceneMode } from '@/DTP_new/libs/DTP.type';
import { CESIUM_CLICK_SCENE_MODES, CESIUM_SCENE_MODES } from '@/DTP_new/configs/globalVariables';

export const useGlobalStore = defineStore('mapGlobalStore', () => {
  // state define
  const viewer = ref<Viewer>();
  const sceneMode = ref<SceneMode>(CESIUM_SCENE_MODES[0]);
  const images = ref<Map<string, Entity>>(new Map());
  const clickMode = ref<ClickSceneMode>(CESIUM_CLICK_SCENE_MODES[0]);
  // getter define with compute
  const scene = computed(() => viewer.value?.scene || null);
  const imageryLayers = computed(() => viewer.value?.imageryLayers);
  const camera = computed(() => viewer.value?.camera);

  const imageIds = computed(() => Array.from(images.value.keys()));
  const billboards = ref<{ entity: Entity }[]>([]);
  const isBlinking = ref<boolean>(true);
  const intervalBlink = ref<ReturnType<typeof setInterval>>();

  // action define
  // TODO: Image action
  function addImage(imageOverlay: Entity, imageId: string) {
    images.value.set(imageId, imageOverlay);
  }
  function removeImage(imageId: string) {
    images.value.delete(imageId);
  }
  function removeAllImages() {
    images.value.forEach((img, key) => {
      removeImage(key);
    });
    images.value.clear();
  }

  function toggleBlinking() {
    isBlinking.value = !isBlinking.value;
  }

  function updateBillboardVisibility(billboardInfo: { entity: Entity }) {
    billboardInfo.entity.billboard.show = isBlinking.value;
  }

  return {
    viewer,
    images,
    sceneMode,
    clickMode,
    //
    scene,
    imageryLayers,
    camera,
    imageIds,
    addImage,
    removeImage,
    removeAllImages,
    billboards,
    isBlinking,
    toggleBlinking,
    updateBillboardVisibility,
    intervalBlink,
  };
});
