export const BASE_MAPS = [
  {
    id: 'base-map-google-street',
    name: 'Bản đồ Street Google',
    preview_image: '/images/baseMap/Google_street_preview.png',
    description: 'Bản đồ đường xá của Google',
    imageryProviderInformation: {
      imageryLayerType: 'UrlTemplateImageryProvider',
      url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
  },
  {
    id: 'base-map-google-hybrid',
    name: 'Bản đồ Google',
    preview_image: '/images/baseMap/Google_hybrid_preview.png',
    description: 'Bản đồ vệ tinh có độ phân giải cao',
    imageryProviderInformation: {
      imageryLayerType: 'UrlTemplateImageryProvider',
      url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
  },
  {
    id: 'base-map-esri',
    name: 'Bản đồ Esri',
    preview_image: '/images/baseMap/Esri_preview.png',
    description: 'Bản đồ vệ tinh có độ phân giải cao kết hợp từ Bing, Esri',
    imageryProviderInformation: {
      imageryLayerType: 'UrlTemplateImageryProvider',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
  },
  {
    id: 'base-map-viettel',
    name: 'Bản đồ Viettel',
    preview_image: '/images/baseMap/Viettel_map_preview.png',
    description: 'Bản đồ vector hành chính, đường đi',
    imageryProviderInformation: {
      imageryLayerType: 'UrlTemplateImageryProvider',
      url: 'https://api-maps.viettel.vn/gateway/mapservice/v1/styles/vtmap/{z}/{x}/{y}.png?access_token=4474ace29cd4d4fa14847303d2a6d6f0',
    },
  },
  {
    id: 'base-map-google-terrain',
    name: 'Bản đồ Terrain Google',
    preview_image: '/images/baseMap/Google_terrain_preview.png',
    description: 'Bản đồ vector hành chính, đường đi',
    imageryProviderInformation: {
      imageryLayerType: 'UrlTemplateImageryProvider',
      url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
  },
];
export const SPECIAL_LAYERS = [
  {
    id: 'special-layers-1',
    name: 'Lớp phủ HPG',
    preview_image:
      'http://192.168.101.88:9000/vetinh/haiphong/anhcatalog/hanhchinh_shapefile_map/catalog_img_district.png',
    description: 'Bản đồ lớp phủ HPG',

    imageryProviderInformation: {
      imageryLayerType: 'WebMapServiceImageryProvider',
      url: 'http://192.168.101.88:8080/geoserver/gismap/wms?',
      layers: 'da781a46-9b22-47bd-9eab-62fa83d5bffe',
      parameters: {
        service: 'WMS',
        request: 'GetMap',
        format: 'image/png',
        transparent: true,
      },
      tileHeight: 256,
      tileWidth: 256,
    },
  },
  {
    id: 'special-layers-2',
    name: 'BHành chính cấp huyện',
    preview_image:
      'http://192.168.101.88:9000/vetinh/haiphong/anhcatalog/hanhchinh_shapefile_map/catalog_img_district.png',
    description: 'Bản đồ hành chính cấp huyện HPG',
    imageryProviderInformation: {
      imageryLayerType: 'WebMapServiceImageryProvider',
      url: 'http://192.168.101.88:8080/geoserver/gismap/wms',
      layers: '960c4f35-fdf7-4275-9381-ca13fe9ac7f1',
      parameters: {
        service: 'WMS',
        request: 'GetMap',
        format: 'image/png',
        transparent: true,
      },
      tileHeight: 256,
      tileWidth: 256,
    },
  },
];
export const HAIPHONG_CENTER_POSITION = {
  latitude: 20.672103932146197,
  longitude: 106.82588296362722,
  height: 53589.828150700065,
  heading: 6.229494303733466,
  pitch: -1.2772273096181563,
  roll: 0.0000035734248120533607,
};
export const DANANG_CENTER_POINT = {
  latitude: 16.096320553722002,
  longitude: 108.22122689928874,
  height: 56.03687883256732,
  heading: 1.9063719124049214,
  pitch: -0.051508673673672734,
  roll: 0.000006644098901276152,
};
export const HANOI_CENTER_POINT = {
  latitude: 21.027559659346412,
  longitude: 105.77502465262427,
  height: 177.55702106244914,
  heading: 2.122669129725054,
  pitch: -0.23209497842392102,
  roll: 6.283163913078726,
};

export const IMAGERY_LAYER_TYPE = {
  WebMapServiceImageryProvider: 'WebMapServiceImageryProvider',
  UrlTemplateImageryProvider: 'UrlTemplateImageryProvider',
};
