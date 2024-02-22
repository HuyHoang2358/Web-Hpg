import { defined, ScreenSpaceEventHandler } from 'cesium';
import { useHandleStore } from '@/stores/handleStore';
import { useGlobalStore } from '@/stores/globalStore';
import { clickEntityHandle } from '@/DTP_new/modules/handles/clickEntityHandle';
// INSIDE FUNCTIONS ----------------------------------------------------------------------------------------------------

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
// Remove all Event Handle ---------------------------------------------------------------------------------------------
// TODO: Remove All handles in viewer
export const removeAllEventHandles = () => {
  const eventHandleStore = useHandleStore(); // Init pinia store
  // Foreach event and off them
  eventHandleStore.handles.forEach((handle: ScreenSpaceEventHandler) => {
    turnOffEventHandle(handle);
  });
  eventHandleStore.handles = []; // reset array handles in store with empty array
};

// TODO: Turn off event handle
export const turnOffEventHandle = (eventHandle: ScreenSpaceEventHandler) => {
  if (eventHandle) eventHandle.destroy(); // destroy screenSpaceEventHandle
};

// TODO: Set event handles default for viewer
export const defaultHandle = () => {
  const eventHandleStore = useHandleStore(); // Init pinia store
  removeAllEventHandles(); // remove all handle in viewer
  const clickEntityEventHandle = clickEntityHandle(); // Turn off click entity Handle
  if (clickEntityEventHandle) eventHandleStore.handles.push(clickEntityEventHandle);
};

// Get Event Move Position ---------------------------------------------------------------------------------------------
// TODO: Extract position (Cartesian 3) of mouse when moving in viewer
export const getEventMovePosition = (eventMove: ScreenSpaceEventHandler.MotionEvent) => {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
  // we get the correct point when mousing over terrain.
  const ray = viewer?.camera.getPickRay(eventMove.endPosition);
  if (!ray) return null;
  // `earthPosition` will be undefined if our mouse is not over the globe.
  const earthPosition = viewer?.scene.globe.pick(ray, viewer.scene);
  if (!defined(earthPosition)) return null;
  return earthPosition;
};

// Get Event Click Position --------------------------------------------------------------------------------------------
// TODO: Extract position (Cartesian 3) of mouse when click in viewer
export const getEventClickPosition = (eventClick: ScreenSpaceEventHandler.PositionedEvent) => {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
  // we get the correct point when mousing over terrain.
  const ray = viewer?.camera.getPickRay(eventClick.position);
  if (!ray) return null;
  // `earthPosition` will be undefined if our mouse is not over the globe.
  const earthPosition = viewer?.scene.globe.pick(ray, viewer.scene);
  if (!defined(earthPosition)) return null;
  return earthPosition;
};
