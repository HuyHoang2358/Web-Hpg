import axios from 'axios';
import { visualizeModelEntity } from '@/DTP_new/modules/Entity/modelEntity';
import { useCityStore } from '@/stores/cityStore';
import { useGlobalStore } from '@/stores/globalStore';
import { addTileSet } from '@/DTP_new/modules/tileset';
import { Cesium3DTileset } from 'cesium';

const fetchDataFromJson = (url: string) => axios.get(url);

const reformatEntityInfo = (jsonEntityInfo: any) => {
  const newFormat = {
    id: jsonEntityInfo._id.id,
    entity: {
      latitude: jsonEntityInfo.attrs.location.value.coordinates[1],
      longitude: jsonEntityInfo.attrs.location.value.coordinates[0],
      height: 0,
      heading: jsonEntityInfo.attrs.heading.value,
      pitch: jsonEntityInfo.attrs.pitch.value,
      roll: jsonEntityInfo.attrs.roll.value,
      scale: jsonEntityInfo.attrs.scale.value,
      model_id: jsonEntityInfo.attrs.modelUrl.value,
    },
    info: {},
  };
  return newFormat;
  //console.log(newFormat);
};
// TODO: remove all city objs
export function removeAllCityObj() {
  const globalStore = useGlobalStore();
  const cityStore = useCityStore();
  const viewer = globalStore.viewer;
  if (!viewer) return;
  const entities = cityStore.entities;
  entities.forEach((entity) => {
    viewer.entities.remove(entity);
  });
  cityStore.entities = [];
  if (cityStore.tileSet) {
    cityStore.tileSet.forEach((tile: any) => {
      viewer.scene.primitives.remove(tile);
    });
  }
  cityStore.tileSet = [];
}
// TODO: View city from json
export async function viewCityFromJson(json_path: string) {
  const cityStore = useCityStore();
  try {
    const res = await fetchDataFromJson(json_path);
    const data = res.data;
    console.log('data', data);
    const newFormatInfo: any[] = [];
    data.map((item: any) => {
      newFormatInfo.push(reformatEntityInfo(item));
    });
    console.log(newFormatInfo);
    // visualize obj
    newFormatInfo.forEach((item) => {
      if (item.entity) {
        const entity = visualizeModelEntity(item.entity);
        if (entity) cityStore.entities.push(entity);
      }
    });
  } catch {
    return null;
  }
}

// TODO: View city from title set

export async function viewCityFromTileSet(tile_set_path: string, is_change_height = false) {
  console.log('view HP');
  const cityStore = useCityStore();
  const tilesets = await addTileSet(tile_set_path, is_change_height);
  if (tilesets) {
    cityStore.tileSet = tilesets;
  }
}
