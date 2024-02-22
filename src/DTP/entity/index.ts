import { useViewerStore } from '@/stores/viewer';
import { BoundingSphere, Cartesian3, Entity, PolygonHierarchy } from 'cesium';
import { useEntityStore } from '@/stores/entity';
import { createPoint } from '@/DTP/entity/point';
import { drawPolygon } from '@/DTP/entity/polygon';
import type { Boundary, CaringAreaResType } from '@/services/apis/map';
import { flyToBoundingSphere } from '@/DTP/mapTool/camera';

export const removeEntity = (entity?: Entity) => {
  const viewerStore = useViewerStore();
  if (!entity) {
    return;
  }

  viewerStore?.viewer?.entities?.remove(entity);
};

export const removeEntities = (entities?: Entity[]) => {
  if (!entities || entities.length === 0) {
    return;
  }

  entities.forEach((p) => {
    removeEntity(p);
  });
};

export const removeCurrentPolygon = () => {
  const entityStore = useEntityStore();

  removeEntity(entityStore.polygon);
  removeEntities(entityStore.points);

  entityStore.polygon = undefined;
  entityStore.polygonInfo = {};
  entityStore.points = [];
};

export const createPolygonByCaringInfo = (item: CaringAreaResType) => {
  const entityStore = useEntityStore();

  removeCurrentPolygon();

  entityStore.polygonInfo = item;
  const latLngs: Boundary = JSON.parse(item.boundary);

  const coordinates = latLngs.coordinates[0];

  const positions = coordinates.map((coord) => {
    const point = Cartesian3.fromDegrees(coord[1], coord[0]);
    const createdPoint = createPoint(point);
    if (createdPoint) {
      entityStore.points.push(createdPoint);
    }
    return point;
  });

  entityStore.polygon = drawPolygon(new PolygonHierarchy(positions));

  const boundingSphere = BoundingSphere.fromPoints(positions);

  flyToBoundingSphere(boundingSphere);
};
