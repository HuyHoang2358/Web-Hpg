import { useGlobalStore } from '@/stores/globalStore';
import { Cartesian3, Cartographic, Cesium3DTileset, Matrix4 } from 'cesium';

export function changeHeightTileset(tileset: any, heightOffset: any) {
  const boundingSphere = tileset.boundingSphere;
  const cartographic = Cartographic.fromCartesian(boundingSphere.center);
  const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
  const offset = Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    heightOffset,
  );
  const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
  tileset.modelMatrix = Matrix4.fromTranslation(translation);
}

export async function addTileSet(tile_set_json_path: string, isChangeHeight = false) {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (!viewer) return;
  const tileset = await Cesium3DTileset.fromUrl(tile_set_json_path, {
    preloadWhenHidden: false,
    maximumScreenSpaceError: 4,
    preferLeaves: true,
    //dynamicScreenSpaceError: true,
    /// dynamicScreenSpaceErrorDensity: 0.00278,
    //dynamicScreenSpaceErrorFactor: 4.0,
    //dynamicScreenSpaceErrorHeightFalloff: 0.25,
    //skipLevelOfDetail: true,
    show: true,
  });
  await viewer.scene.primitives.add(tileset);
  await viewer.zoomTo(tileset);

  const ans = [tileset];
  if (isChangeHeight) {
    changeHeightTileset(tileset, 20);
    const tileset1 = await Cesium3DTileset.fromIonAssetId(2469263);
    await viewer.scene.primitives.add(tileset1);
    ans.push(tileset1);
  }
  return ans;
}
