import { ICON_WARNING_URL } from '@/DTP/config';
import type { LayerResType } from '@/DTP_new/libs/DTP.type';

import type { ChangeInformation } from '@/services/apis/layer';
import { useMapStore } from '@/stores/map';
import { useViewerStore } from '@/stores/viewer';
import {
  Cartesian2,
  Cartesian3,
  SplitDirection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';

import { useGlobalStore } from '@/stores/globalStore';
import { createImageryLayer } from '@/DTP_new/modules/imageryLayer';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';

function clearCompareLayer() {
  const mapStore = useMapStore();
  if (mapStore.sideBySideMap) {
    mapStore.sideBySideMap.remove();
    mapStore.resetSideBySideMap();
  }

  if (mapStore.changePoints) {
    mapStore.changePoints.remove();
    mapStore.setChangePoints(undefined);
  }
}

// TODO: Init Compare map split
/*
export const initImageryLayersSplit = (layer1: LayerResType, layer2: LayerResType) => {
  console.log('initImageryLayersSplit');
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (!viewer) {
    return;
  }

  // remove all imageryLayers
  viewer?.imageryLayers?.removeAll();
  console.log('remove all imageryLayers');

  const layers = viewer?.imageryLayers;

  console.log('reFormat layer 1', reFormatMapInfo(layer1));
  console.log('reFormat layer 2', reFormatMapInfo(layer2));

  const imageLayer1 = createImageryLayer(reFormatMapInfo(layer1).imageryProviderInformation);
  const imageLayer2 = createImageryLayer(reFormatMapInfo(layer2).imageryProviderInformation);

  console.log('imageLayer1', imageLayer1);
  console.log('imageLayer2', imageLayer2);

  if (!imageLayer1 || !imageLayer2) return;

  // add layer 1 in left
  imageLayer1.splitDirection = SplitDirection.LEFT; // Only show to the left of the slider.
  layers?.add(imageLayer1);
  // add layer 2 in right
  imageLayer2.splitDirection = SplitDirection.RIGHT; // Only show to the left of the slider.
  layers?.add(imageLayer2);
  // Sync the position of the slider with the split position
  const slider = document.getElementById('slider') as HTMLCanvasElement;
  console.log('slider', slider);
  if (!slider || !slider?.parentElement) return;

  viewer.scene.splitPosition = slider?.offsetLeft / slider?.parentElement?.offsetWidth;
  const handler = new ScreenSpaceEventHandler(slider);

  let moveActive = false;
  function move(movement: any) {
    if (!moveActive) return;

    const relativeOffset = movement.endPosition.x;
    const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
    slider.style.left = `${100.0 * splitPosition}%`;
    viewer.scene.splitPosition = splitPosition;
  }

  handler.setInputAction(function () {
    moveActive = true;
  }, ScreenSpaceEventType.LEFT_DOWN);
  handler.setInputAction(function () {
    moveActive = true;
  }, ScreenSpaceEventType.PINCH_START);

  handler.setInputAction(move, ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(move, ScreenSpaceEventType.PINCH_MOVE);

  handler.setInputAction(function () {
    moveActive = false;
  }, ScreenSpaceEventType.LEFT_UP);
  handler.setInputAction(function () {
    moveActive = false;
  }, ScreenSpaceEventType.PINCH_END);
};
*/

export function stopComparingLayers() {
  clearCompareLayer();
}

export function addChangeDetection(changePoints: ChangeInformation[]) {
  const viewerStore = useViewerStore();

  changePoints.forEach((changePoint) => {
    const position = Cartesian3.fromDegrees(
      changePoint.center_point.lng,
      changePoint.center_point.lat,
    );

    const iconSize = new Cartesian2(18.61, 24);

    viewerStore.viewer?.entities.add({
      name: 'Marker' + changePoint.center_point.lat + changePoint.center_point.lng,
      position: position,
      billboard: {
        image: ICON_WARNING_URL,
        width: iconSize.x,
        height: iconSize.y,
      },
    });
  });
}
