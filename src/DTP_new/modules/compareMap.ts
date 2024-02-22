import type { LayerResType } from '@/DTP_new/libs/DTP.type';
import { useGlobalStore } from '@/stores/globalStore';
import { reFormatMapInfo } from '@/DTP_new/libs/reFormat';
import { createImageryLayer, removeALlImageryLayer } from '@/DTP_new/modules/imageryLayer';
import { ScreenSpaceEventHandler, ScreenSpaceEventType, SplitDirection } from 'cesium';
import { useLayerStore } from '@/stores/LayerStore';

// TODO: Init screen to compare 2 map
export const initImageryLayersSplit = (mapBefore: LayerResType, mapAfter: LayerResType) => {
  // define store
  const globalStore = useGlobalStore();
  const layerStore = useLayerStore();
  const viewer = globalStore.viewer;

  if (!viewer) return;

  // remove all imageryLayers
  removeALlImageryLayer();

  // reFormat map information
  const reFormatMapBefore = reFormatMapInfo(mapBefore);
  const reFormatMapAfter = reFormatMapInfo(mapAfter);

  // create ImageryLayer
  const imageLayerBefore = createImageryLayer(reFormatMapBefore.imageryProviderInformation);
  const imageLayerAfter = createImageryLayer(reFormatMapAfter.imageryProviderInformation);

  // Check null imageryLayer
  if (!imageLayerBefore || !imageLayerAfter) return;

  // Set Split Direction for map
  imageLayerBefore.splitDirection = SplitDirection.LEFT; // Only show to the left of the slider.
  imageLayerAfter.splitDirection = SplitDirection.RIGHT; // Only show to the left of the slider.

  // Add map before into viewer
  const layerBeforeIndex = viewer?.imageryLayers.length || 0;
  viewer?.imageryLayers.add(imageLayerBefore, layerBeforeIndex);
  layerStore.imageryLayers.set(reFormatMapBefore.id, {
    layerIndex: layerBeforeIndex,
    isShow: true,
    isBaseLayer: false,
  });

  const layerAfterIndex = viewer?.imageryLayers.length || 0;
  viewer?.imageryLayers.add(imageLayerAfter, layerAfterIndex);
  layerStore.imageryLayers.set(reFormatMapAfter.id, {
    layerIndex: layerAfterIndex,
    isShow: true,
    isBaseLayer: false,
  });

  // Sync the position of the slider with the split position
  const slider = document.getElementById('slider') as HTMLCanvasElement;
  if (!slider || !slider?.parentElement) return;

  // calculate offset left for slider
  viewer.scene.splitPosition = slider?.offsetLeft / slider?.parentElement?.offsetWidth;

  // TODO: Create event handler for slider when click and move left, move right
  const sliderEventHandler = new ScreenSpaceEventHandler(slider);

  let moveActive = false;
  function moveAction(movement: any) {
    if (!moveActive) return;
    if (!slider || !slider?.parentElement || viewer === undefined) return;
    const relativeOffset = movement.endPosition.x;
    const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
    slider.style.left = `${100.0 * splitPosition}%`;
    viewer.scene.splitPosition = splitPosition;
  }

  sliderEventHandler.setInputAction(function () {
    moveActive = true;
  }, ScreenSpaceEventType.LEFT_DOWN);
  sliderEventHandler.setInputAction(function () {
    moveActive = true;
  }, ScreenSpaceEventType.PINCH_START);

  sliderEventHandler.setInputAction(moveAction, ScreenSpaceEventType.MOUSE_MOVE);
  sliderEventHandler.setInputAction(moveAction, ScreenSpaceEventType.PINCH_MOVE);

  sliderEventHandler.setInputAction(function () {
    moveActive = false;
  }, ScreenSpaceEventType.LEFT_UP);
  sliderEventHandler.setInputAction(function () {
    moveActive = false;
  }, ScreenSpaceEventType.PINCH_END);
};
