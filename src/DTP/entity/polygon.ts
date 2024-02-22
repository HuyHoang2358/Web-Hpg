import {
  CallbackProperty,
  Cartesian3,
  Color,
  ColorMaterialProperty,
  PolygonHierarchy,
} from 'cesium';
import { useViewerStore } from '@/stores/viewer';

export function drawPolygon(positionData: PolygonHierarchy | Cartesian3[] | CallbackProperty) {
  const viewerStore = useViewerStore();
  const viewer = viewerStore.viewer;

  return viewer?.entities.add({
    polygon: {
      hierarchy: positionData,
      material: new ColorMaterialProperty(Color.WHITE.withAlpha(0.6)),
    },
  });
}

export function drawPolyline(positionData: Cartesian3[] | CallbackProperty) {
  const viewerStore = useViewerStore();
  const viewer = viewerStore.viewer;

  return viewer?.entities.add({
    polyline: {
      positions: positionData,
      clampToGround: true,
      width: 1.5,
      material: new ColorMaterialProperty(Color.RED),
    },
  });
}
