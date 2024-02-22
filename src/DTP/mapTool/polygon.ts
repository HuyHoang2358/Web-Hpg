import { useViewerStore } from '@/stores/viewer';
import {
  CallbackProperty,
  Cartesian3,
  ConstantPositionProperty,
  defined,
  Entity,
  PolygonHierarchy,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { createPoint } from '@/DTP/entity/point';
import { drawPolygon } from '@/DTP/entity/polygon';
import { useEntityStore } from '@/stores/entity';
import { removeCurrentPolygon, removeEntity } from '@/DTP/entity';
import { useMapToolStore } from '@/stores/mapTool';

export const useDrawPolygon = () => {
  let activeShapePoints: Cartesian3[] = [];
  let activeShape: Entity | undefined;
  let floatingPoint: Entity | undefined;
  const drawingMode = 'polygon';

  const leftClickEvent = (event: ScreenSpaceEventHandler.PositionedEvent) => {
    const entityStore = useEntityStore();
    const viewerStore = useViewerStore();
    const viewer = viewerStore.viewer;

    // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const ray = viewer?.camera.getPickRay(event.position);
    if (!ray) {
      return;
    }

    const earthPosition = viewer?.scene.globe.pick(ray, viewer.scene);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (!defined(earthPosition)) {
      return;
    }

    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition);
      activeShapePoints.push(earthPosition);
      const dynamicPositions = new CallbackProperty(function () {
        if (drawingMode === 'polygon') {
          return new PolygonHierarchy(activeShapePoints);
        }
        return activeShapePoints;
      }, false);

      activeShape = drawPolygon(dynamicPositions);
    }

    activeShapePoints.push(earthPosition);
    const point = createPoint(earthPosition);
    if (point) {
      entityStore.points.push(point);
    }
  };

  const mouseMoveEvent = (event: ScreenSpaceEventHandler.MotionEvent) => {
    const viewerStore = useViewerStore();
    const viewer = viewerStore.viewer;
    if (!defined(floatingPoint)) {
      return;
    }

    const ray = viewer?.camera.getPickRay(event.endPosition);
    if (!ray) {
      return;
    }

    const newPosition = viewer?.scene.globe.pick(ray, viewer.scene);
    if (!defined(newPosition)) {
      return;
    }

    floatingPoint.position = new ConstantPositionProperty(newPosition);
    activeShapePoints.pop();
    activeShapePoints.push(newPosition);
  };

  // Redraw the shape so it's not dynamic and remove the dynamic shape.
  function terminateShape() {
    const entityStore = useEntityStore();
    activeShapePoints.pop();
    entityStore.polygon = drawPolygon(activeShapePoints);
    removeEntity(floatingPoint);
    removeEntity(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    activeShapePoints = [];
  }

  const startDrawingPolygon = () => {
    const viewerStore = useViewerStore();
    const mapToolStore = useMapToolStore();
    const viewer = viewerStore.viewer;
    const handler = new ScreenSpaceEventHandler(viewer?.canvas);
    removeCurrentPolygon();

    viewer?.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
    handler.setInputAction(leftClickEvent, ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(mouseMoveEvent, ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function () {
      terminateShape();
      handler.destroy();
      mapToolStore.iconToolActive = undefined;
    }, ScreenSpaceEventType.RIGHT_CLICK);
  };

  return {
    startDrawingPolygon,
  };
};
