import type { LayerResType } from '@/DTP_new/libs/DTP.type';

export function reFormatMapInfo(layer: LayerResType, isGetFeatureInfo = false) {
  let parameters = {};
  if (isGetFeatureInfo) {
    parameters = {
      ...layer.layers[0].getFeatureInfoParameterDto,
      request: 'GetMap',
      format: 'image/png',
      transparent: true,
    };
  } else {
    parameters = {
      ...layer.layers[0].getMapParameterDto,
    };
  }
  //console.log('parameters', parameters);

  //console.log('layer: ', layer);
  const newFormat = {
    id: layer.mapId,
    imageryProviderInformation: {
      imageryLayerType: layer.layers[0].imageryLayerType,
      url: layer.layers[0].url,
      layers: layer.layers[0].layers,
      parameters: parameters,
      /*     parameters: {
        service: 'WMS',
        request: 'GetFeatureInfo',
        format: 'image/png',
        transparent: true,
      },*/
    },
  };
  //console.log('newFormat: ', newFormat);
  return newFormat;
}
