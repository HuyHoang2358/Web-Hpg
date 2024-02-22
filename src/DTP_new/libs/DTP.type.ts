import type { Geometry } from '@/services/commonTypes';

export type SceneMode = {
  id: string;
  name: string;
};

export type ClickSceneMode = {
  id: string;
  name: string;
};

export type MapFeatureInfo = {
  key: string;
  value: string | number | null;
};

export type ImageryLayerDetail = {
  layerIndex: number;
  isShow: boolean;
  isBaseLayer: boolean;
};
export type PointPosition = {
  latitude: number;
  longitude: number;
  height: number;
};
export type CameraPosition = PointPosition & {
  heading: number;
  pitch: number;
  roll: number;
};
export type OptionType = {
  label: string;
  value: string;
};

export type LayerResType = {
  mapId: string;
  mapInfoDto: MapInfoDTO;
  layers: Layer[];
};

export interface MapInfoDTO {
  mapName: string;
  createdDate: number[];
  thumbnailPath: string;
  resolution: string;
}

export interface Layer {
  layerId: string;
  layerInfoDto: LayerInfoDTO;
  url: string;
  layers: string;
  imageryLayerType?: string;
  getMapParameterDto: GetMapParameterDTO;
  getFeatureInfoParameterDto: GetFeatureInfoParameterDTO;
}
export interface LayerInfoDTO {
  mapName: string;
  layerName: string;
  thumbnailPath: string;
  layerProvider: string;
  sourceProvider: string;
  description: string;
  createdDate: number[];
  sharing: string;
  layerType: string;
  category: string;
}

export interface GetMapParameterDTO {
  service: string;
  layers: string;
  srs: string;
  width: string;
  height: string;
}

export interface GetFeatureInfoParameterDTO {
  service: string;
  layers: string;
  srs: string;
  width: string;
  height: string;
}

export interface ChangeDetectionInformation {
  area: string;
  change_type: string;
  object_type: string;
  commune: string;
  deforest_area: string;
  district: string;
  latitude: string;
  location_on_image: string;
  longitude: string;
  province: string;
  satellite_image_after_filename: string;
  satellite_image_after_id: string;
  satellite_image_before_filename: string;
  satellite_image_before_id: string;
  scene_image: string;
  time_period_after: string;
  time_period_before: string;
  uuid: string;
}

export type ChangeDetectionChart = {
  labels: string[];
  data: number[];
};
