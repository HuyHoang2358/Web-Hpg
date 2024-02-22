import { Cartesian3, Color, Entity, JulianDate, PositionProperty } from 'cesium';
import { useGlobalStore } from '@/stores/globalStore';

// EXPORT FUNCTIONS ----------------------------------------------------------------------------------------------------
// Draw Point Entity -------------------------------------------------------------------------------------------------
// TODO: Draw point entity with format of position is cartesian3
export function drawPointEntity(
  worldPosition: PositionProperty | Cartesian3,
  pointName: string = '',
) {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;

  return viewer?.entities.add({
    position: worldPosition,
    name: pointName,
    point: {
      color: Color.WHITE,
      pixelSize: 6,
      outlineColor: Color.RED,
      outlineWidth: 2,
    },
  });
}

// Extract Points From Polygon Hierarchy
// TODO: Extract position from point entity with format Cartesian3
export function extractPositionFromPointEntity(pointEntity: Entity) {
  return pointEntity.position?.getValue(JulianDate.now());
}
