import { useGlobalStore } from '@/stores/globalStore';
import { Math, Cartesian3, Cartesian2, Cartographic } from 'cesium';
import { CAMERA_AMOUNT_METE_ZOOM } from '@/DTP_new/configs/globalVariables';
import { round } from '@turf/turf';
import type { CameraPosition } from '@/DTP_new/libs/DTP.type';

// TODO: Get position of mouse click to viewer
export const getMouseClickPosition = (mouseClickPosition: Cartesian2) => {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  const camera = globalStore.camera;
  if (camera && viewer) {
    const cartesian = camera.pickEllipsoid(mouseClickPosition, viewer.scene.globe.ellipsoid);
    if (cartesian) {
      const cartographic = Cartographic.fromCartesian(cartesian);
      const longitude = parseFloat(Math.toDegrees(cartographic.longitude).toFixed(6));
      const latitude = parseFloat(Math.toDegrees(cartographic.latitude).toFixed(6));
      return {
        latitude: latitude,
        longitude: longitude,
        height: 0,
      };
    }
  }
  return null;
};

// TODO: Get position of camera
export const getCameraPosition = () => {
  const globalStore = useGlobalStore();
  const camera = globalStore.camera;
  if (camera) {
    // get position by cartographic coordinate
    const positionCartographic = camera.positionCartographic;
    /*writeLog('camera position', {
      latitude: Math.toDegrees(positionCartographic.latitude),
      longitude: Math.toDegrees(positionCartographic.longitude),
      height: positionCartographic.height,
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    });*/
    return {
      latitude: Math.toDegrees(positionCartographic.latitude),
      longitude: Math.toDegrees(positionCartographic.longitude),
      height: positionCartographic.height,
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    };
  }
  return null;
};

// TODO: Zoom map with typeZoom: true - zoom in map  and typeZoom = false - zoom out map
const zoomMap = (typeZoom: boolean, amountMeteZoom?: number) => {
  // typeZoom: true - zoomIn  ||  false - zoom Out
  if (!amountMeteZoom) amountMeteZoom = CAMERA_AMOUNT_METE_ZOOM; // number of meter of each zoom

  // Define global store
  const globalStore = useGlobalStore();
  const camera = globalStore.camera;

  if (camera) {
    const cameraPosition = getCameraPosition();
    console.log(cameraPosition);
    // handle exception when amountMeteZoom > distance between camera and earth around
    if (cameraPosition && cameraPosition.height > amountMeteZoom)
      amountMeteZoom = round(cameraPosition.height / 4);

    /*
     * Simple method with cesium function's zoomIn and zoomOut
     * if (typeZoom) camera.zoomIn(amountMeteZoom);
     * else camera.zoomOut(amountMeteZoom);
     */

    // Smooth zoom by using flyTo function
    if (cameraPosition?.height) {
      // Default destination is new camera position when zoom out
      let destination = Cartesian3.fromDegrees(
        cameraPosition.longitude,
        cameraPosition.latitude,
        cameraPosition.height + amountMeteZoom,
      );

      // If typeZoom=  true -> change height of camera to zoom in
      if (typeZoom)
        destination = Cartesian3.fromDegrees(
          cameraPosition.longitude,
          cameraPosition.latitude,
          cameraPosition.height - amountMeteZoom,
        );

      // Move camera to new position with time moving (duration) is 1 second
      camera.flyTo({
        destination: destination,
        duration: 1,
      });
    }
  }
};

// TODO: Zoom In Function
export const zoomInMap = (amountMeteZoom?: number) => {
  zoomMap(true, amountMeteZoom);
};

// TODO: Zoom Out Function
export const zoomOutMap = (amountMeteZoom?: number) => {
  zoomMap(false, amountMeteZoom);
};

// TODO: Move camera to new position
export const flyToPosition = (position: CameraPosition) => {
  const globalStore = useGlobalStore();
  const camera = globalStore.camera;
  // If exist camera
  if (camera) {
    camera.flyTo({
      destination: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
      orientation: { heading: position.heading, pitch: position.pitch, roll: position.roll },
    });
  }
};
