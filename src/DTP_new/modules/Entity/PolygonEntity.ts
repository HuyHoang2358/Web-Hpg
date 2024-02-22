import {
  CallbackProperty,
  Cartesian3,
  Color,
  ColorMaterialProperty,
  Entity,
  JulianDate,
} from 'cesium';
import { useGlobalStore } from '@/stores/globalStore';

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
// Draw polygon Entity -------------------------------------------------------------------------------------------------
// TODO: Draw polygon entity from array cartesian3 with callbackProperty
export function drawPolygonEntity(
  positionData: Cartesian3[] | CallbackProperty,
  polygonName: string = '',
) {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  return viewer?.entities.add({
    name: polygonName,
    polygon: {
      hierarchy: positionData,
      material: new ColorMaterialProperty(Color.WHITE.withAlpha(0.6)),
    },
  });
}

// Extract Points From Polygon Hierarchy
// TODO: Extract all points from polygon hierarchy entity with format Cartesian3
export function extractPointsFromPolygonHierarchy(polygonEntity: Entity) {
  return polygonEntity.polygon?.hierarchy?.getValue(JulianDate.now()).positions || [];
}
