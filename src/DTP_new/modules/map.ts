import { Viewer, Ion, Terrain, Cartesian3 } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { Ref } from 'vue';
import { hiddenHTMLElementByClassName } from '@/DTP_new/libs/common';
import { useGlobalStore } from '@/stores/globalStore';
import type { SceneMode } from '@/DTP_new/libs/DTP.type';
import { turnOffEventHandle } from '@/DTP_new/modules/handles/handle';
import { flyToPosition, getCameraPosition } from '@/DTP_new/modules/camera';
import { addImageryLayer } from '@/DTP_new/modules/imageryLayer';
import { BASE_MAPS, HAIPHONG_CENTER_POSITION } from '@/DTP_new/configs/constant';
import { CESIUM_ION_TOKEN, HIDDEN_HTML_EL_CLASSES } from '@/DTP_new/configs/globalVariables';

// TODO: mount viewer into div HTML element
const mountViewer = (cesiumContainerRef: Ref) => {
  const viewer = new Viewer(cesiumContainerRef.value, {
    baseLayerPicker: false, // remove button baseLayerPicker
    vrButton: false, // remove button view by VR mode
    geocoder: false,
    navigationHelpButton: false,
    selectionIndicator: true,
    /* terrain: Terrain.fromWorldTerrain({
      requestWaterMask: true, // Request to server get water tile
      requestVertexNormals: true,
    }),*/
    shadows: false,
    timeline: false,
    sceneModePicker: false, // type show map
    animation: true,
    fullscreenButton: false,
    baseLayer: false,
  });
  const globalStore = useGlobalStore();
  globalStore.viewer = viewer;

  // Turn Off handle click to space
  turnOffEventHandle(viewer.screenSpaceEventHandler);

  viewer.cesiumWidget.creditContainer.parentNode?.removeChild(viewer.cesiumWidget.creditContainer);
};

// TODO: Init new map in cesium js
export const initMap = (cesiumContainerRef: Ref) => {
  // set token
  Ion.defaultAccessToken = CESIUM_ION_TOKEN;

  // mount viewer
  mountViewer(cesiumContainerRef);

  // Hidden logos
  hiddenHTMLElementByClassName(HIDDEN_HTML_EL_CLASSES);

  // move camera to hai phong
  flyToPosition(HAIPHONG_CENTER_POSITION);

  // add a base map
  addImageryLayer(BASE_MAPS[1], 0);
};

// TODO: Change Scene Mode to 2D, 3D, 4D
export const changeSceneMode = (sceneMode: SceneMode) => {
  // Create global store
  const globalStore = useGlobalStore();
  const scene = globalStore.scene;
  const camera = globalStore.camera;
  // Save current camera position before change mode
  const cameraPosition = getCameraPosition();
  console.log(cameraPosition);

  // Change mode and update into store
  if (globalStore.sceneMode.id !== sceneMode.id && cameraPosition) {
    sceneMode.id === '2D' ? globalStore?.scene?.morphTo2D() : globalStore?.scene?.morphTo3D();
    globalStore.sceneMode = sceneMode;

    // move camera to current position
    if (scene && camera) {
      // listener event when scene change mode successfully, so then add a timeout  300ms for fly to previous camera position
      scene.morphComplete.addEventListener(function () {
        setTimeout(function () {
          camera.flyTo({
            destination: Cartesian3.fromDegrees(
              cameraPosition.longitude,
              cameraPosition.latitude,
              cameraPosition.height,
            ),
          });
        }, 300);
      });
    }
  }
};
