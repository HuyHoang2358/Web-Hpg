import { useGlobalStore } from '@/stores/globalStore';
import { defined, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import {
  editPolygonHandle,
  initEditPolygonMode,
} from '@/DTP_new/modules/handles/drawPolygonHandle';

// INSIDE FUNCTIONS ----------------------------------------------------------------------------------------------------

// Left Click Event ----------------------------------------------------------------------------------------------------
// TODO: Process when left click into viewer -
const leftClickEvent = (eventClick: ScreenSpaceEventHandler.PositionedEvent) => {
  // Init pinia store
  const globalStore = useGlobalStore();
  const scene = globalStore.scene; // get scene
  if (!scene) return;

  const pickedEntity = scene.pick(eventClick.position);
  if (defined(pickedEntity)) {
    // console.log('pickedEntity:', pickedEntity);
    const pickedEntityName = pickedEntity.id.name;
    // console.log('pickedEntityName:', pickedEntityName);

    if (pickedEntityName) {
      switch (pickedEntityName) {
        case 'polygon-draw':
          initEditPolygonMode(pickedEntity.id);
          break;
        case 'main-point-polygon-draw':
          editPolygonHandle(pickedEntity.id);
          break;
        default:
          break;
      }
    }
  }
};

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
export const clickEntityHandle = () => {
  // Init pinia store
  const globalStore = useGlobalStore();
  const scene = globalStore.scene; // get scene

  // If exist scene, we will create new event handle
  if (scene) {
    const clickEntityEventHandle = new ScreenSpaceEventHandler(scene.canvas);
    clickEntityEventHandle.setInputAction(leftClickEvent, ScreenSpaceEventType.LEFT_CLICK);

    return clickEntityEventHandle;
  }
  return;
};
