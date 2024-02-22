// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
import {
  Cartographic,
  Math,
  Resource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { useGlobalStore } from '@/stores/globalStore';
import { getEventClickPosition } from '@/DTP_new/modules/handles/handle';
import { useLayerStore } from '@/stores/LayerStore';
import { useHandleStore } from '@/stores/handleStore';
import { useMapToolStore } from '@/stores/mapTool';
import { ICON_TOOL_ACTIVE } from '@/utils/enums';

// INSIDE FUNCTIONS ----------------------------------------------------------------------------------------------------

// Left Click Event ----------------------------------------------------------------------------------------------------
// TODO: Process when left click into viewer -
const leftClickEvent = (eventClick: ScreenSpaceEventHandler.PositionedEvent) => {
  const earthPosition = getEventClickPosition(eventClick); // extract position from mouse click event
  if (earthPosition) {
    const cartographic = Cartographic.fromCartesian(earthPosition);
    const latitude = Math.toDegrees(cartographic.latitude);
    const longitude = Math.toDegrees(cartographic.longitude);
    getFeatureInfo(latitude, longitude);
  }
};

// Get featureInfo
function getFeatureInfo(lat: number, lng: number) {
  const layerStore = useLayerStore();
  const mapToolStore = useMapToolStore();
  const getFeatureLayer = layerStore.getFeatureLayerInfo;

  //console.log('lat', lat);
  //console.log('lng', lng);

  const offsetLat = 0.00003;
  const offsetLng = 0.00003;

  if (getFeatureLayer) {
    // console.log('getFeatureLayer', getFeatureLayer);

    const params = {
      ...getFeatureLayer.layers[0].getFeatureInfoParameterDto,
      BBOX: `${lng - offsetLng},${lat - offsetLat},${lng + offsetLng},${lat + offsetLat}`, // TODO: Add Radius
    };

    // console.log('params', params);
    const urlParam = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const url = getFeatureLayer.layers[0].url + '?' + urlParam;
    // console.log('url', url);

    Resource.fetchJson(url)
      ?.then(function (data) {
        //console.log('res:', data);

        // turn on box information
        mapToolStore.changeActiveTool(ICON_TOOL_ACTIVE.CHANGE_DETECTION_INFO);
        layerStore.featurePropertiesChangeDetection = data.features[0].properties;
      })
      .catch(function (error) {
        // console.log('err:', error);
        mapToolStore.changeActiveTool();
      });
  }
}

export const clickGetFeatureHandle = () => {
  // Init pinia store
  const globalStore = useGlobalStore();
  const handleStore = useHandleStore();
  const scene = globalStore.scene; // get scene
  // If exist scene, we will create new event handle

  if (scene) {
    const clickGetFeatureEventHandle = new ScreenSpaceEventHandler(scene.canvas);
    clickGetFeatureEventHandle.setInputAction(leftClickEvent, ScreenSpaceEventType.LEFT_CLICK);
    // add handle to store
    handleStore.handles.push(clickGetFeatureEventHandle);
  }
  return;
};
