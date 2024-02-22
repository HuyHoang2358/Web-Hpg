import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Cesium3DTileset, Entity } from 'cesium';

export const useCityStore = defineStore('useCityStore', () => {
  // state define
  const entities = ref<Entity[]>([]);
  const tileSet = ref<Cesium3DTileset[]>([]);

  return {
    entities,
    tileSet,
  };
});
