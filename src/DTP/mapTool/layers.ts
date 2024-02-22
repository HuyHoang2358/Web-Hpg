import type { Layer, LayerResType } from '@/DTP/DTP.type';
import {
  ImageMaterialProperty,
  ImageryLayer,
  Rectangle,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
} from 'cesium';
import { useLayersStore } from '@/stores/layers';
import { useViewerStore } from '@/stores/viewer';
import type { ImagePreviewResponseModel } from '@/services/apis/layer';
import { createImageLayersFromMap } from '@/DTP/common';
import { toRaw } from 'vue';

export const createImageLayer = (layer: Layer) => {
  if (layer.getMapParameterDto.service === 'wms') {
    return new ImageryLayer(
      new WebMapServiceImageryProvider({
        url: layer.url,
        layers: layer?.layers || '',
        parameters: {
          service: 'WMS',
          request: 'GetMap',
          format: 'image/png',
          transparent: true,
        },
      }),
    );
  } else {
    return new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: layer.geo_url,
        subdomains: layer.options?.subdomains,
      }),
    );
  }
};

export function removeLayer(layerId: string) {
  const viewerStore = useViewerStore();
  const layersStore = useLayersStore();

  const imageLayer = layersStore.layers.get(layerId);
  imageLayer && viewerStore.viewer?.imageryLayers.remove(imageLayer);
}

export function hideLayer(layerId: string) {
  const layersStore = useLayersStore();
  const imageLayer = layersStore.layers.get(layerId);
  if (imageLayer) {
    imageLayer.show = false;
  }
}

export function showLayer(layerId: string) {
  const layersStore = useLayersStore();
  const imageLayer = layersStore.layers.get(layerId);
  if (imageLayer) {
    imageLayer.show = true;
  }
}

export function addBaseLayer(imageryLayer: ImageryLayer) {
  const viewerStore = useViewerStore();

  viewerStore.viewer?.imageryLayers.add(imageryLayer);
}

export function addLayer(imageryLayer: ImageryLayer, layerId: string) {
  const viewerStore = useViewerStore();
  const layerStore = useLayersStore();

  viewerStore.viewer?.imageryLayers.add(imageryLayer);
  layerStore.layers.set(layerId, imageryLayer);
}

export function changeOrderLayers(oldIndex: number, newIndex: number) {
  console.log('oldIndex', oldIndex);
  console.log('newIndex', newIndex);
  // const layersStore = useLayersStore();
  // const viewerStore = useViewerStore();

  // const layers = viewerStore.viewer?.scene.imageryLayers;
  //
  // layers._layers = arrayMove(layers?._layers, oldIndex, newIndex);
  //
  // viewerStore.viewer?.scene.requestRender();

  // console.log(
  //   'viewerStore.viewer?.scene.imageryLayers',
  //   toRaw(),
  // );

  // layerIds.forEach((id) => {
  //   const imageLayer = layersStore.layers.get(id);
  //   imageLayer && viewerStore.viewer?.imageryLayers.raise(imageLayer);
  // });
}
export async function changeOpacityLayers(layerIds: string[], opacity: number) {
  const layersStore = useLayersStore();

  layersStore.layers.forEach((imageLayer, key) => {
    if (layerIds.includes(key)) {
      imageLayer.alpha = opacity / 100;
    }
  });
}

export function removeAllLayersOnMap() {
  const layersStore = useLayersStore();
  layersStore.layers.forEach((imageLayer, id) => {
    removeLayer(id);
  });
  layersStore.removeAllLayerDisplayed();
}

// async function handleClickMap(e: L.LeafletMouseEvent) {
//   const mapStore = useMapStore();
//   const map = mapStore.map;
//   const initialPoint = L.latLng(e.latlng.lat, e.latlng.lng);
//
//   const bounds = L.latLngBounds([initialPoint]);
//
//   const offsetLat = 0.000548;
//   const offsetLng = -0.000545;
//
//   const secondPoint = L.latLng(initialPoint.lat + offsetLat, initialPoint.lng + offsetLng);
//   bounds.extend(secondPoint);
//   const thirdPoint = L.latLng(initialPoint.lat - offsetLat, initialPoint.lng - offsetLng);
//   bounds.extend(thirdPoint);
//
//   try {
//     const data = await objectDetect({
//       SERVICE: 'WMS',
//       VERSION: '1.1.1',
//       REQUEST: 'GetFeatureInfo',
//       FORMAT: 'image/png',
//       TRANSPARENT: true,
//       QUERY_LAYERS: 'gismap:ai_detect_object',
//       STYLES: '',
//       LAYERS: 'gismap:ai_detect_object',
//       exceptions: 'application/vnd.ogc.se_inimage',
//       INFO_FORMAT: 'text/html',
//       FEATURE_COUNT: 50,
//       SRS: 'EPSG:4326',
//       WIDTH: 101,
//       HEIGHT: 101,
//       X: 50,
//       Y: 50,
//       info_format: 'application/json',
//       BBOX: bounds.toBBoxString(),
//     });
//
//     if (data.data?.numberReturned !== 0) {
//       L.popup()
//         .setLatLng({
//           lat: e.latlng.lat,
//           lng: e.latlng.lng,
//         })
//         .setContent(`<div id='popup-container-detect-${data?.data?.features[0].id}'/>`)
//         .openOn(toRaw(map as L.Map));
//
//       const popupContainer = document.getElementById(
//         `popup-container-detect-${data?.data?.features[0].id}`,
//       );
//       if (popupContainer) {
//         const popupApp = createApp(ObjectDetect, {
//           feature: data?.data?.features[0],
//         });
//         popupApp.mount(popupContainer);
//       }
//     }
//   } catch (e) {
//     notification.error({ message: 'Thông báo', description: 'Đã xảy ra lỗi!' });
//   }
// }

export function mapClickHandle() {
  // const mapStore = useMapStore();
  // const map = mapStore.originalMap;
  // if (map) {
  //   map.on('click', handle_click_map);
  // }
}
export function offMapClick() {
  // const mapStore = useMapStore();
  // const map = mapStore.originalMap;
  // if (map) {
  //   map.off('click', handle_click_map);
  // }
}

export const changeBaseLayer = async (layerInfo: LayerResType) => {
  const viewerStore = useViewerStore();
  const layerStore = useLayersStore();

  if (layerStore.baseLayers.length !== 0) {
    // console.log('viewerStore.viewer?.imageryLayers', toRaw(viewerStore.viewer?.imageryLayers));
    // layerStore.baseLayers.forEach((item) => {
    //   viewerStore.viewer?.imageryLayers?.remove(item);
    // });
  }

  if (layerInfo.layers.length === 0) {
    return;
  }

  layerStore.baseLayers = createImageLayersFromMap(layerInfo.layers);
  layerStore.baseLayerInfo = layerInfo;

  layerStore.baseLayers.forEach((item) => {
    addBaseLayer(item);
  });

  // const minZoom = 11; // Mức zoom tối thiểu mong muốn
  //
  // viewerStore.viewer?.scene.preUpdate.addEventListener(function (scene, time) {
  //   const camera = scene.camera;
  //   const altitude = camera.positionCartographic.height;
  //
  //   // Kiểm tra mức zoom tối thiểu
  //   if (altitude < leafletZoomToCesiumHeight(11)) {
  //     // Đặt mức zoom về giới hạn tối thiểu
  //     camera.zoomTo(camera.positionCartographic, minZoom);
  //   }
  // });

  // if (map) {
  //   layerInfo?.options?.minZoom && map.setMinZoom(layerInfo?.options?.minZoom);
  //   mapLayer.addTo(toRaw(map as L.Map));
  // }
  //
  // mapStore.setBaseMap(mapLayer);
};

export function removeImage(imageId: string) {
  const viewerStore = useViewerStore();
  const layersStore = useLayersStore();
  const viewer = viewerStore.viewer;

  const imageOverlay = layersStore.images.get(imageId);
  imageOverlay && viewer?.entities.remove(imageOverlay);
  layersStore.removeImage(imageId);
}

export function removeAllImages() {
  const layersStore = useLayersStore();

  layersStore.images.forEach((img, key) => {
    removeImage(key);
  });
}

export function addImage(imageInfo: ImagePreviewResponseModel) {
  const viewerStore = useViewerStore();
  const layersStore = useLayersStore();
  const viewer = viewerStore.viewer;

  const pointsLeaflet = imageInfo.footprint;

  // Tạo bounding rectangle
  const boundingRectangle = Rectangle.fromDegrees(
    Math.min(...pointsLeaflet.map((p) => p[0])),
    Math.min(...pointsLeaflet.map((p) => p[1])),
    Math.max(...pointsLeaflet.map((p) => p[0])),
    Math.max(...pointsLeaflet.map((p) => p[1])),
  );

  // TODO: add yellow border for image
  // Thêm hình ảnh vào Cesium
  const imageOverlay = viewer?.entities.add({
    rectangle: {
      coordinates: boundingRectangle,
      material: new ImageMaterialProperty({
        image: imageInfo.image_url,
        transparent: true,
      }),
    },
  });

  if (imageOverlay) {
    viewer?.zoomTo(imageOverlay);
    layersStore.addImage(imageOverlay, imageInfo.id);
  }
}
