import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Cartesian3, Entity, ScreenSpaceEventHandler } from 'cesium';

export const useDrawToolStore = defineStore('drawToolStore', () => {
  // state define

  const isDrawing = ref<boolean>(false);
  const drawingMode = ref<string>('polygon');
  const points = ref<Cartesian3[]>([]);
  const pointEntities = ref<Entity[]>([]);
  const selectingPointEntity = ref<Entity>();
  const selectingPointIndex = ref<number>();
  const polygon = ref<Entity>();
  const polyline = ref<Entity>();
  const middlePoints = ref<Cartesian3[]>([]);
  const drawEventHandle = ref<ScreenSpaceEventHandler>();

  // ACTION FUNCTIONS --------------------------------------------------------------------------------------------------
  // TODO:  Push a new point in queue `points`
  function pushPoint(newPoint: Cartesian3) {
    // Check if points is not empty, [point1, point2, ... , move point]
    if (points.value.length > 0) {
      // pop move point before add new point into `points`
      const movePoint = points.value.pop();

      points.value.push(newPoint);
      if (movePoint) points.value.push(movePoint);
    }
  }

  function pushPointEntity(newPointEntity: Entity) {
    if (pointEntities.value.length > 0) {
      const movePointEntity = pointEntities.value.pop();
      pointEntities.value.push(newPointEntity);
      if (movePointEntity) pointEntities.value.push(movePointEntity);
    }
  }

  function updateSelectingPointIndex(point: Cartesian3) {
    selectingPointIndex.value = points.value.findIndex(
      (element) =>
        Math.trunc(element.x) === Math.trunc(point.x) &&
        Math.trunc(element.y) === Math.trunc(point.y) &&
        Math.trunc(element.z) === Math.trunc(point.z),
    );
  }
  return {
    points,
    middlePoints,
    pointEntities,
    selectingPointEntity,
    selectingPointIndex,
    polygon,
    polyline,
    isDrawing,
    drawingMode,
    drawEventHandle,
    pushPoint,
    pushPointEntity,
    updateSelectingPointIndex,
  };
});
