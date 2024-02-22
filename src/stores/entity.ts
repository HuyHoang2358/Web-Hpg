import { defineStore } from 'pinia';
import { computed, type ComputedRef, ref } from 'vue';
import { Cartesian3, Entity, JulianDate } from 'cesium';
import {
  convertCartesian3ToLatLngCoordinates,
  convertLatLngCoordinatesToRegionBody,
} from '@/DTP/common';
import type { CaringAreaResType } from '@/services/apis/map';

export const useEntityStore = defineStore('entity', () => {
  const polygon = ref<Entity>();
  const polygonInfo = ref<Partial<CaringAreaResType>>({});
  const points = ref<Entity[]>([]);
  const isDrawPolygon = ref(false);

  const polygonPositions: ComputedRef<Cartesian3[]> = computed(
    () => polygon.value?.polygon?.hierarchy?.getValue(JulianDate.now()).positions,
  );

  const polygonLatLngCoordinates: ComputedRef<number[][]> = computed(() =>
    convertCartesian3ToLatLngCoordinates(polygonPositions.value),
  );

  const regionSearchBody = computed(() =>
    convertLatLngCoordinatesToRegionBody(polygonLatLngCoordinates.value),
  );

  const regionSaveBody = computed(() =>
    convertLatLngCoordinatesToRegionBody(
      polygonLatLngCoordinates.value.map((item) => [item[1], item[0]]),
    ),
  );

  return {
    polygon,
    points,
    isDrawPolygon,
    polygonPositions,
    polygonLatLngCoordinates,
    regionSearchBody,
    regionSaveBody,
    polygonInfo,
  };
});
