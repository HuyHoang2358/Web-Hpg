import dayjs from 'dayjs';
import { useMapStore } from '@/stores/map';
import { addChangeDetection } from '@/DTP/mapTool/compareLayers';
import type { Boundary } from '@/services/apis/map';
import { type Cartesian3 } from 'cesium';
import { useViewerStore } from '@/stores/viewer';
import * as Cesium from 'cesium';
import { addLayer, createImageLayer } from '@/DTP/mapTool/layers';
import type { Layer } from '@/DTP/DTP.type';

export const insert = (arr: any[], index: number, newItem: any) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];

export const convertBoundaryToRegionBody = (boundary: string) => {
  const latLngs: Boundary = JSON.parse(boundary);
  const coordinates = latLngs.coordinates[0];

  return JSON.stringify({
    type: 'Polygon',
    coordinates: [coordinates.map((coord) => [coord[1], coord[0]])],
  });
};

export const getUnixMilliseconds = () => dayjs().valueOf();

export function arrayMove(arr: any[], old_index: number, new_index: number) {
  return arr.map((item, index) => {
    if (old_index === index) {
      return arr[new_index];
    } else if (new_index === index) {
      return arr[old_index];
    } else return item;
  });
}

export const listToTree = (data: any[]) => {
  if (data.length === 0) {
    return [];
  }
  const tree = data
    .map((e) => ({ ...e }))
    .sort((a, b) => a.id - b.id)
    .reduce((a, e) => {
      a[e.id] = a[e.id] || e;
      a[e.parentId] = a[e.parentId] || {};
      const parent = a[e.parentId];
      parent.children = parent.children || [];
      parent.children.push(e);
      return a;
    }, {});
  // @ts-ignore
  return Object.values(tree).find((e: any) => e.id === undefined).children;
};

export const filterOption = (input: string, option: any) => {
  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export const changeChartLabels = (arr: string[]) =>
  arr.map((i) =>
    i.replace('Quận', 'Q.').replace('Huyện', 'H.').replace('quận', 'Q.').replace('huyện', 'H.'),
  );

let timeOutAddDetectChange: ReturnType<typeof setTimeout>;

export const addBackDetection = (timeOut?: number) => {
  const mapStore = useMapStore();
  if (mapStore.isShouldBackDetectChange) {
    timeOutAddDetectChange = setTimeout(() => {
      addChangeDetection(mapStore.currentChangeInformation || []);
    }, timeOut || 100);
  }
};

export const removeDetection = () => {
  const mapStore = useMapStore();
  clearTimeout(timeOutAddDetectChange);
  mapStore.changePoints?.remove();
};

export const convertCartesian3ToLatLngCoordinates = (positions: Cartesian3[]) => {
  const viewerStore = useViewerStore();

  const cesiumScene = viewerStore.viewer?.scene;

  if (!cesiumScene) {
    return [[]];
  }

  const ellipsoid = cesiumScene.globe.ellipsoid;

  return positions.map((item) => {
    const cartographic = ellipsoid?.cartesianToCartographic(item);
    return [
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude),
    ];
  });
};

export const convertLatLngCoordinatesToRegionBody = (latLngCoordinates: number[][]) => {
  return JSON.stringify({
    type: 'Polygon',
    coordinates: [latLngCoordinates],
  });
};

export const createImageLayersFromMap = (layers: Layer[]) => {
  return layers.map((item) => {
    const imageLayer = createImageLayer(item);
    addLayer(imageLayer, item.layerId);
    return imageLayer;
  });
};
