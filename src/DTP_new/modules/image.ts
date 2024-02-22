import type { ImagesInMapResType } from '@/services/apis/map';
import { useGlobalStore } from '@/stores/globalStore';
import { Color, ImageMaterialProperty, Rectangle } from 'cesium';

// INSIDE FUNCTIONS ----------------------------------------------------------------------------------------------------

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------

// TODO: Remove Image out of viewer
export function removeImage(imageId: string) {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  const imageOverlay = globalStore.images.get(imageId);
  imageOverlay && viewer?.entities.remove(imageOverlay);
  globalStore.removeImage(imageId);
}

// TODO: Remove all images out of viewer
export function removeAllImages() {
  const globalStore = useGlobalStore();
  globalStore.images.forEach((img, key) => {
    removeImage(key);
  });
}
// TODO: Add new Image into viewer
export function addImage(imageInfo: ImagesInMapResType) {
  // define store
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;

  const boundingBoxCoordinate = imageInfo.boundingBox.coordinates[0];
  // Create bounding rectangle
  const boundingRectangle = Rectangle.fromDegrees(
    Math.min(...boundingBoxCoordinate.map((p) => p[0])),
    Math.min(...boundingBoxCoordinate.map((p) => p[1])),
    Math.max(...boundingBoxCoordinate.map((p) => p[0])),
    Math.max(...boundingBoxCoordinate.map((p) => p[1])),
  );

  // FIXME: add yellow border for image - can't show because terrain map
  const imageOverlay = viewer?.entities.add({
    rectangle: {
      coordinates: boundingRectangle,
      outline: true,
      outlineColor: Color.YELLOW,
      outlineWidth: 5,
      material: new ImageMaterialProperty({
        image: imageInfo.fullPathUrl,
        transparent: true,
      }),
    },
  });
  if (imageOverlay) {
    viewer?.zoomTo(imageOverlay);
    globalStore.addImage(imageOverlay, imageInfo.id);
  }
}
