import {
  GetFeatureInfoFormat,
  ImageryLayer,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
} from 'cesium';
import type { MapFeatureInfo } from '@/DTP_new/libs/DTP.type';
import { useGlobalStore } from '@/stores/globalStore';
import { useLayerStore } from '@/stores/LayerStore';
import { useLayersStore } from '@/stores/layers';
import { computed } from 'vue';

// TODO: Create imagery Provider from  WMS
const createWebMapServiceImageryProvider = (
  layerInformation: Pick<
    WebMapServiceImageryProvider.ConstructorOptions,
    'getFeatureInfoFormats' | 'url' | 'tileHeight' | 'tileWidth' | 'layers' | 'parameters'
  >,
  callBackFunc?: () => MapFeatureInfo[],
) => {
  //console.log('layerInformation', layerInformation);
  return new ImageryLayer(
    new WebMapServiceImageryProvider({
      getFeatureInfoParameters: new GetFeatureInfoFormat('json', 'application/json', callBackFunc),
      ...layerInformation,
    }),
  );
};

// TODO: Create imagery provider from URL template
const createUrlTemplateImageryProvider = (
  imageryOptions: UrlTemplateImageryProvider.ConstructorOptions,
) => {
  return new ImageryLayer(new UrlTemplateImageryProvider(imageryOptions));
};

// TODO: Create imagery Layer provider
export const createImageryLayer = (imageryLayerInformation: any) => {
  switch (imageryLayerInformation.imageryLayerType) {
    case 'WebMapServiceImageryProvider':
      return createWebMapServiceImageryProvider(imageryLayerInformation);
    case 'UrlTemplateImageryProvider':
      return createUrlTemplateImageryProvider(imageryLayerInformation);
    default:
      return null;
  }
};

// TODO: Change index of imagery layer in viewer.imageryLayers
export const changeIndexImageryLayer = (layerId: string, newIndex: number) => {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayerDetail = layerStore.imageryLayers.get(layerId);
  if (imageryLayerDetail) {
    const layerIndex = imageryLayerDetail.layerIndex;
    const imageryLayer = globalStore.imageryLayers?.get(layerIndex);
    if (imageryLayer) {
      // newIndex in after index
      if (newIndex > layerIndex) {
        layerStore.updateLayerIndex(layerIndex + 1, newIndex, false);
        for (let i = 1; i <= newIndex - layerIndex; i++)
          globalStore.viewer?.imageryLayers.lower(imageryLayer);
      } else {
        layerStore.updateLayerIndex(newIndex, layerIndex - 1, true);
        for (let i = 1; i <= newIndex - layerIndex; i++)
          globalStore.viewer?.imageryLayers.raise(imageryLayer);
      }
      imageryLayerDetail.layerIndex = newIndex;
    }
  }
};

export const hiddenLayer = (layerId: string) => {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayerDetail = layerStore.imageryLayers.get(layerId);
  if (imageryLayerDetail) {
    const imageryLayer = globalStore.imageryLayers?.get(imageryLayerDetail.layerIndex);
    if (imageryLayer) {
      imageryLayer.show = false;
      imageryLayerDetail.isShow = false;
    }
  }
};

export const showLayer = (layerId: string) => {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayerDetail = layerStore.imageryLayers.get(layerId);
  if (imageryLayerDetail) {
    const imageryLayer = globalStore.imageryLayers?.get(imageryLayerDetail.layerIndex);
    if (imageryLayer) {
      imageryLayer.show = true;
      imageryLayerDetail.isShow = true;
    }
  }
};

// TODO: remove imagery layer by layerId
export const removeImageryLayer = (layerId: string) => {
  console.log('iiii', layerId);
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayerDetail = layerStore.imageryLayers.get(layerId);

  if (imageryLayerDetail) {
    const layerIndex = imageryLayerDetail.layerIndex;
    const imageryLayer = globalStore.imageryLayers?.get(layerIndex);
    // remove from cesium viewer
    imageryLayer && globalStore.viewer?.imageryLayers.remove(imageryLayer);

    //Remove from imageryLayers/LayerStore
    layerStore.imageryLayers.delete(layerId);

    // update layerIndex
    layerStore.updateLayerIndex(layerIndex + 1, -1, false);
  }
};

// TODO: CHANGE OPACITY of Layer
export function changeOpacityLayers(layerIds: string[], opacity: number) {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayers = layerStore.imageryLayers;
  const viewer = globalStore.viewer;
  if (!viewer) return;
  layerIds.forEach((layerId) => {
    const imageryLayer = imageryLayers.get(layerId);
    if (imageryLayer) viewer.imageryLayers.get(imageryLayer.layerIndex).alpha = opacity / 100;
  });
}
// TODO: Hide layer
export function hideImageryLayer(layerId: string) {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayers = layerStore.imageryLayers;
  const viewer = globalStore.viewer;
  if (!viewer) return;
  // get imageryLayer detail
  const imageryLayer = imageryLayers.get(layerId);
  if (imageryLayer) viewer.imageryLayers.get(imageryLayer.layerIndex).show = false;
}

// TODO: Show layer
export function showImageryLayer(layerId: string) {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const imageryLayers = layerStore.imageryLayers;
  const viewer = globalStore.viewer;
  if (!viewer) return;
  // get imageryLayer detail
  const imageryLayer = imageryLayers.get(layerId);
  if (imageryLayer) viewer.imageryLayers.get(imageryLayer.layerIndex).show = true;
}

// TODO: Remove base layer
export function removeBaseLayer() {
  const layerStore = useLayerStore();
  if (layerStore.baseLayerIds.length > layerStore.baseLayerIndex) {
    const baseLayerId = layerStore.baseLayerIds[layerStore.baseLayerIndex];
    removeImageryLayer(baseLayerId);
  }
}
// TODO: Remove all ImageryLayer
export function removeALlImageryLayer() {
  const layerStore = useLayerStore();
  const allLayerIds = layerStore.allLayerIds;
  allLayerIds.forEach((layerId) => {
    removeImageryLayer(layerId);
  });
  //console.log(allLayerIds);
}
export function removeALl1ImageryLayer() {
  const layerStore = useLayerStore();
  const allLayerIds = Array.from(layerStore.imageryLayers)
    .filter(([, layerDetail]) => layerDetail.layerIndex > layerStore.baseLayerIndex)
    .map(([id]) => id);

  console.log('allLayerIds', allLayerIds);
  allLayerIds.forEach((layerId) => {
    removeImageryLayer(layerId);
  });
}
export function removeALl2ImageryLayer() {
  const layerStore = useLayerStore();
  const allLayerIds = Array.from(layerStore.imageryLayers)
    .filter(([, layerDetail]) => layerDetail.layerIndex >= 2)
    .map(([id]) => id);

  allLayerIds.forEach((layerId) => {
    removeImageryLayer(layerId);
  });
}

// TODO: Add a imageryLayer into viewer
export function addImageryLayer(imageryLayerInformation: any, index: number = -1) {
  const globalStore = useGlobalStore(); // get global Store
  const viewer = globalStore.viewer; // get viewer
  const layerStore = useLayerStore(); // Get imagery Store
  const imageryLayer = createImageryLayer(imageryLayerInformation.imageryProviderInformation);

  if (imageryLayer) {
    // if not exist imageryLayer with ID
    if (layerStore.imageryLayers.get(imageryLayerInformation.id) == undefined) {
      // calculate index of layer when add to viewer
      let layerIndex = index === 0 ? (removeBaseLayer(), 0) : viewer?.imageryLayers.length || 0;
      if (layerIndex === 0) {
        if (layerStore.baseLayerIds.length >= layerStore.baseLayerIndex) {
          layerIndex = layerStore.baseLayerIndex;
          layerStore.baseMapId = imageryLayerInformation.id;
        } else layerIndex = 0;
      }
      // add to viewer with layerIndex
      layerStore.updateLayerIndex(layerIndex);
      viewer?.imageryLayers.add(imageryLayer, layerIndex);

      layerStore.imageryLayers.set(imageryLayerInformation.id, {
        layerIndex: layerIndex,
        isShow: true,
        isBaseLayer: index === 0,
      });
    } else {
      // if exist imageryLayer with ID
    }
  }
  console.log('layers:', viewer?.imageryLayers);
  console.log('ID__layers:', layerStore.imageryLayers);
}

export function removeAllShowingLayers() {
  const layerStore = useLayerStore();
  layerStore.showingImageryLayers.forEach(([key]) => {
    removeImageryLayer(key);
  });
}

export function removeBillboards() {
  const globalStore = useGlobalStore();
  clearInterval(globalStore.intervalBlink);
  globalStore.billboards.forEach((b) => {
    globalStore.viewer?.entities.remove(b.entity);
  });
}

export function changeOpacityOfTopLayers(opacity: number) {
  const layerStore = useLayerStore();
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (!viewer) return;

  const imageryLayers = layerStore.imageryLayers;
  const layerId = Array.from(imageryLayers)[Array.from(imageryLayers).length - 1][0];

  changeOpacityLayers([layerId], opacity);
}
