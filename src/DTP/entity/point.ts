import type { PinType } from '@/services/commonTypes';
import * as Cesium from 'cesium';
import { useViewerStore } from '@/stores/viewer';
import { Cartesian3, Color, PositionProperty } from 'cesium';

export function addPin(pins: PinType[]) {
  const mapStore = useViewerStore();
  const viewer = mapStore.viewer;

  const pinBuilder = new Cesium.PinBuilder();

  pins.forEach((i) => {
    const position = Cesium.Cartesian3.fromDegrees(i.location[0], i.location[1]);

    const iconSize = new Cesium.Cartesian2(24, 24);
    // Tạo Billboard cho marker
    viewer?.entities.add({
      name: 'Marker' + i.id,
      position: position,
      billboard: {
        image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
        // image: i.icon,
        // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.1),
        // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        width: iconSize.x,
        height: iconSize.y,
      },
    });
    // const labelElement = (viewer.container).find('.cesium-viewer-label');
    // labelElement.html(
    //   '<p style="color: red;">Đây là một đoạn văn bản HTML tùy chỉnh.</p><br><a href="http://example.com">Link đến trang web</a>',
    // );
  });
}

export const createPoint = (worldPosition: PositionProperty | Cartesian3) => {
  const viewerStore = useViewerStore();
  const viewer = viewerStore.viewer;
  return viewer?.entities.add({
    position: worldPosition,
    point: {
      color: Color.WHITE,
      pixelSize: 6,
      outlineColor: Color.RED,
      outlineWidth: 2,
    },
  });
};
