import type { LayerResType } from '@/DTP/DTP.type';

export const OPEN_WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?';
export const OPEN_WEATHER_KEY = '5cfaedeb7d13b253bfb28db69e508755';
export const OPEN_WEATHER_ICON_URL = 'https://openweathermap.org/img/wn/';
export const MAP_MIN_ZOOM = 9;
export const IS_LIMIT_BOUNDING_BOX = true;
export const MAX_BOUNDING_BOX = {
  southWest: { lat: 19.63224019048384, lng: 104.66125488281251 }, // Tây nam (trái dưới)
  northEast: { lat: 22.083094832921418, lng: 109.17938232421876 }, //  Đông Bắc (phải trên),
};
export const ESRI_MAP_BASE_LAYER: LayerResType = {
  url: '',
  id: 'ESRI_MAP_BASE_LAYER',
  catalog_image: '',
  layer_name: '',
  period_photo: '',
  query_layers: '',
  resolution: '',
  time: '',
  name: 'ESRI',
  type: 'remote',
  geo_url:
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  options: {
    zIndex: 0,
  },
  sort_order: 0,
};
export const VIETTEL_MAP_BASE_LAYER: LayerResType = {
  url: '',
  id: 'VIETTEL_MAP_BASE_LAYER',
  catalog_image: '',
  layer_name: '',
  period_photo: '',
  query_layers: '',
  resolution: '',
  time: '',
  name: 'ViettelMap',
  type: 'remote',
  geo_url:
    'https://api-maps.viettel.vn/gateway/mapservice/v1/styles/vtmap/{z}/{x}/{y}.png?access_token=4474ace29cd4d4fa14847303d2a6d6f0',
  options: {
    zIndex: 0,
  },
  sort_order: 0,
};
// export const ADMINISTRATIVE_BOUNDARIES_DISTRICT_BASE_LAYER = {
//   name: 'Bản đồ địa giới hành chính quận huyện',
//   type: 'wms',
//   geo_url: 'http://172.16.30.214:8080/geoserver/gismap/wms?',
//   options: {
//     zIndex: 1,
//     layers: 'ban_do_hanh_chinh_tp_hai_phong_cap_quan_huyen',
//     format: 'image/png',
//     transparent: true,
//     tiled: true,
//   },
// };
// export const ADMINISTRATIVE_BOUNDARIES_COMMUNE_BASE_LAYER = {
//   name: 'Bản đồ địa giới hành chính xã phường',
//   type: 'wms',
//   geo_url: 'http://172.16.30.214:8080/geoserver/gismap/wms?',
//   options: {
//     zIndex: 1,
//     layers: 'ban_do_hanh_chinh_tp_hai_phong_cap_xa_phuong',
//   },
// };
export const ADMINISTRATIVE_BOUNDARIES_CITY_BASE_LAYER: LayerResType = {
  url: '',
  id: 'ADMINISTRATIVE_BOUNDARIES_CITY_BASE_LAYER',
  catalog_image: '',
  layer_name: '',
  period_photo: '',
  query_layers: '',
  resolution: '',
  time: '',
  name: 'Bản đồ địa giới hành chính tỉnh ',
  type: 'wms',
  geo_url: 'http://172.16.30.214:8080/geoserver/gismap/wms?',
  options: {
    zIndex: 1,
    layers: 'ban_do_hanh_chinh_tp_hai_phong',
  },
  sort_order: 0,
};
export const ICON_WARNING_URL = '/images/icons/warning-icon.png';
export const DRAWING_POLYGON_COLOR = '#EE0023';
// export const DRAWING_POINT_COLOR = '#EE0023';
export const DRAWING_POLYLINE_COLOR = '#EE0023';
// export const DRAWING_BEGIN_POINT_ICON = '/images/icons/beginPoint.png';

export const EARTH_RADIUS = 6371000;
export const BASE_DISTANCE = 1000;
export const MAP_ZOOM_BASE = 11;
export const defaultMapConfig = {
  centerPoint: {
    lat: 20.74487704975893,
    lng: 106.74282073974611,
  },
  zoom: 11,
};

export const mapId = 'map';
