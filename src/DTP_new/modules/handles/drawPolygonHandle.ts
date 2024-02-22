import {
  CallbackProperty,
  Cartesian3,
  ConstantPositionProperty,
  Entity,
  PolygonHierarchy,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { useGlobalStore } from '@/stores/globalStore';
import { useDrawToolStore } from '@/stores/drawToolStore';
import {
  drawPolygonEntity,
  extractPointsFromPolygonHierarchy,
} from '@/DTP_new/modules/Entity/PolygonEntity';
import {
  drawPointEntity,
  extractPositionFromPointEntity,
} from '@/DTP_new/modules/Entity/PointEntity';
import {
  defaultHandle,
  getEventClickPosition,
  getEventMovePosition,
  removeAllEventHandles,
  turnOffEventHandle,
} from '@/DTP_new/modules/handles/handle';
import { useMapToolStore } from '@/stores/mapTool';

// INSIDE FUNCTIONS ----------------------------------------------------------------------------------------------------

// Mouse Move Event ----------------------------------------------------------------------------------------------------
// TODO: Process when move mouse into viewer - view mouse position and polygon temp
const mouseMoveEvent = (eventMove: ScreenSpaceEventHandler.MotionEvent) => {
  const earthPosition = getEventMovePosition(eventMove); // extract position from mouse move event
  if (earthPosition === null) return;
  const drawToolStore = useDrawToolStore();
  // If not exist move point (final point in array drawToolStore.points)
  if (drawToolStore.points.length === 0) {
    drawToolStore.points.push(earthPosition); // push move point
    const movePointEntity = drawPointEntity(earthPosition); // visualize a move point in viewer
    if (movePointEntity) drawToolStore.pointEntities.push(movePointEntity); // Save move point entity to store
  } else {
    // If exist move point in array drawToolStore.points
    drawToolStore.points.pop(); // remove old move point
    drawToolStore.points.push(earthPosition); // push new move point
    const movePointEntity = drawToolStore.pointEntities.pop(); // get move point entity
    if (movePointEntity) {
      movePointEntity.position = new ConstantPositionProperty(earthPosition); // update new position for move point
      drawToolStore.pointEntities.push(movePointEntity); // add new move Point entity to pointEntities
    }
  }
};

// Left Click Event ----------------------------------------------------------------------------------------------------
// TODO: Process when left click into viewer - add new point into Polygon
const leftClickEvent = (eventClick: ScreenSpaceEventHandler.PositionedEvent) => {
  const drawToolStore = useDrawToolStore();
  const earthPosition = getEventClickPosition(eventClick); // extract position from mouse click event
  if (earthPosition === null) return;
  const pointEntity = drawPointEntity(earthPosition); // visualize a point in viewer
  if (pointEntity) drawToolStore.pushPointEntity(pointEntity); // Push a new point entity (not move point) in store
  drawToolStore.pushPoint(earthPosition); // Push a new point (not move point) in store
  if (drawToolStore.points.length === 2) {
    // if not exist polygon entity - we will create a new polygon entity through polygon Hierarchy
    // polygon auto change when change array points
    const dynamicPositions = new CallbackProperty(function () {
      if (drawToolStore.drawingMode === 'polygon')
        return new PolygonHierarchy(drawToolStore.points);
      return drawToolStore.points; // return list point to draw polyline
    }, false);
    drawToolStore.polygon = drawPolygonEntity(dynamicPositions, 'polygon-draw'); // visualize a new polygon in viewer
  }
};

// Left Double Click Event ---------------------------------------------------------------------------------------------
// TODO: Process when left double click into viewer - stop drawing
const leftDoubleClickEvent = () => {
  const drawToolStore = useDrawToolStore();
  const mapToolStore = useMapToolStore();
  if (drawToolStore.drawEventHandle) turnOffEventHandle(drawToolStore.drawEventHandle);
  if (drawToolStore.points.length >= 2) {
    drawToolStore.points.pop(); // remove move point
    drawToolStore.points.pop(); // remove duplicate point
  }
  console.log('DRAW: ', drawToolStore.points);

  // remove active class for icon polygon
  mapToolStore.iconToolActive = undefined;

  // remove point entity
  clearPointEntities();

  // remove move point
  defaultHandle(); // set default Event Handle
};

// Change Point Position with Left Click Event -------------------------------------------------------------------------
// TODO: Process when change position of selecting point with left click event
const changePointPositionLeftClickEvent = (eventClick: ScreenSpaceEventHandler.PositionedEvent) => {
  const drawToolStore = useDrawToolStore();
  const earthPosition = getEventClickPosition(eventClick); // extract position from mouse click event
  if (earthPosition === null) return;

  // off handle
  if (drawToolStore.drawEventHandle) turnOffEventHandle(drawToolStore.drawEventHandle);
  const selectingPointEntity = drawToolStore.selectingPointEntity;
  if (selectingPointEntity)
    selectingPointEntity.position = new ConstantPositionProperty(earthPosition);

  if (drawToolStore.selectingPointIndex !== undefined && drawToolStore.selectingPointIndex >= 0)
    drawToolStore.points[drawToolStore.selectingPointIndex] = earthPosition;
  defaultHandle();
};

// Change Point Position with Mouse Move Event -------------------------------------------------------------------------
// TODO: Process when change position of selecting point with mouse move event
const changePointPositionMouseMoveEvent = (eventMove: ScreenSpaceEventHandler.MotionEvent) => {
  const earthPosition = getEventMovePosition(eventMove); // extract position from mouse move event
  if (earthPosition === null) return;

  // update position of selecting point entity
  const drawToolStore = useDrawToolStore();
  const selectingPointEntity = drawToolStore.selectingPointEntity;
  if (selectingPointEntity)
    selectingPointEntity.position = new ConstantPositionProperty(earthPosition);

  if (drawToolStore.selectingPointIndex !== undefined && drawToolStore.selectingPointIndex >= 0)
    drawToolStore.points[drawToolStore.selectingPointIndex] = earthPosition;
};

// Clear Point Entities ------------------------------------------------------------------------------------------------
// TODO: Remove All Point Entities out of viewer
const clearPointEntities = () => {
  const drawToolStore = useDrawToolStore();
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (viewer) {
    drawToolStore.pointEntities.forEach((pointEntity) => {
      viewer.entities.remove(pointEntity);
    });
    drawToolStore.pointEntities = [];
  }
};

// Clear Draw store ----------------------------------------------------------------------------------------------------
// TODO: Clear drawToolStore
export const clearDrawStore = () => {
  const drawToolStore = useDrawToolStore();
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (viewer) {
    drawToolStore.points = [];
    drawToolStore.pointEntities.forEach((pointEntity) => {
      viewer.entities.remove(pointEntity);
    });
    drawToolStore.pointEntities = [];
    if (drawToolStore.polygon) viewer.entities.remove(drawToolStore.polygon);
  }
};

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
// TODO: Draw polygon Handle
export const drawPolygonHandle = () => {
  // Init pinia store
  const globalStore = useGlobalStore();
  const drawToolStore = useDrawToolStore();
  const scene = globalStore.scene; // get scene
  // Prepare handle
  clearDrawStore();

  // If exist scene, we will create new event handle
  if (scene) {
    const drawPolygonEventHandle = new ScreenSpaceEventHandler(scene.canvas);
    drawToolStore.drawEventHandle = drawPolygonEventHandle; // save handle to store
    // --- add event handle with mouse left click || update polygon
    drawPolygonEventHandle.setInputAction(leftClickEvent, ScreenSpaceEventType.LEFT_CLICK);
    // --- add event handle with mouse move || add point tmp and polygon tmp
    drawPolygonEventHandle.setInputAction(mouseMoveEvent, ScreenSpaceEventType.MOUSE_MOVE);
    // --- add event handle with left double click || remove event handle when double click
    drawPolygonEventHandle.setInputAction(
      leftDoubleClickEvent,
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
  }
};

// TODO: Edit Polygon
export const initEditPolygonMode = (polygonEntity: Entity) => {
  const points = extractPointsFromPolygonHierarchy(polygonEntity);
  console.log('CLICK: ', points);
  // init pinia store
  const drawToolStore = useDrawToolStore();
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;

  // clear all points
  clearPointEntities();
  drawToolStore.points = [];

  // visualize all points
  points.forEach((point: Cartesian3) => {
    drawToolStore.points.push(point);
    const pointEntity = drawPointEntity(point, 'main-point-polygon-draw');
    if (pointEntity) drawToolStore.pointEntities.push(pointEntity);
  });
  // visualize middle points

  // remove polygon entity
  if (drawToolStore.polygon) viewer?.entities.remove(drawToolStore.polygon);

  // visualize polygon
  const dynamicPositions = new CallbackProperty(function () {
    return new PolygonHierarchy(drawToolStore.points);
  }, false);
  drawToolStore.polygon = drawPolygonEntity(dynamicPositions, 'polygon-draw'); // visualize a new polygon in viewer
};

// TODO: Edit Polygon Handle
export const editPolygonHandle = (pointEntity: Entity) => {
  // Init pinia store
  const globalStore = useGlobalStore();
  const drawToolStore = useDrawToolStore();
  const scene = globalStore.scene; // get scene

  removeAllEventHandles(); // remove all handles

  drawToolStore.selectingPointEntity = pointEntity; // update selecting point entity into store

  const selectingPointPosition = extractPositionFromPointEntity(drawToolStore.selectingPointEntity);
  if (selectingPointPosition) {
    drawToolStore.updateSelectingPointIndex(selectingPointPosition);
  }

  // update selecting point index into store
  // If exist scene, we will create new event handle
  if (scene) {
    // Init new event Handle
    const changePositionPointEventHandle = new ScreenSpaceEventHandler(scene.canvas);
    drawToolStore.drawEventHandle = changePositionPointEventHandle; // save handle to store
    // --- add event handle with mouse left click || stop handle
    changePositionPointEventHandle.setInputAction(
      changePointPositionLeftClickEvent,
      ScreenSpaceEventType.LEFT_CLICK,
    );
    // --- add event handle with mouse move || update new position for point entity
    changePositionPointEventHandle.setInputAction(
      changePointPositionMouseMoveEvent,
      ScreenSpaceEventType.MOUSE_MOVE,
    );
  }
};
