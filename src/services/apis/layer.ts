import clientGeoApi from '@/services/clientGeoApi';
import {
  API_ADD_LAYER,
  API_AI_CLASSIFICATION_STATISTIC,
  API_AI_GET_DETECT_OBJECT_STATISTIC,
  API_DELETE_LAYER,
  API_DOWNLOAD_DETECT_OBJECT,
  API_GET_CHANGE_POINTS_BY_POLYGONS,
  API_SEARCH_ADDRESS,
  API_UPDATE_LAYER,
  GEO_API_COMPARE_LAYERS,
  GEO_API_GET_CATEGORIES,
  GEO_API_GET_DETECT_OBJECT_MAP_DATA,
  GEO_API_GET_IMAGES_IN_LAYER,
  GEO_API_GET_LAYER_BY_FIELD,
  GEO_API_GET_LAYER_DETAIL,
  GEO_API_REPORT_CHANGE,
} from '@/utils/apiPath';
import type { Geometry, PinType, WrapperResponse } from '@/services/commonTypes';
import type { LatLngLiteral } from 'leaflet';
import type { LayerResType } from '@/DTP/DTP.type';
import { GROUP_LAYER_TYPE } from '@/utils/enums';
import type { AIChangeDetectionParams } from '@/services/apis/map';

export interface CompareLayersResType {
  layer_1: LayerResType;
  layer_2: LayerResType;
  change_information: ChangeInformation[];
}

export interface ChangeInformation {
  center_point: LatLngLiteral;
  location: string;
  address: string;
  type: string;
  level: number;
  change_area: number;
  time: string;
  image_detect_url: string;
  geometry: Geometry;
}

export interface ImagesInLayerResType {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  imagePreviewResponseModels: ImagePreviewResponseModel[];
}

export interface ImagePreviewResponseModel {
  id: string;
  image_url: string;
  time: string;
  footprint: number[][];
}
export interface ChangeReportResponseModel {
  name: string;
  rows: Record<string, number>;
}

export type CompareLayerParams = {
  resolution: string;
  satelliteImageAfterId: string;
  satelliteImageBeforeId: string;
  region?: string;
};

export type LayersByCategoryRequestParams = {
  categoryId: string;
  resolution?: string;
};

export type LayersByFieldRequestParams = {
  unitId: string;
};

export type LayerDetailResType = {
  id: string;
  name: string;
  type: string;
  source_provider: string;
  layerType: string;
  layerGeoName: string;
  url: string;
  typeService: string;
  region_id: string;
  category_id: string;
  isLocalLayer: boolean;
  description: string;
  sharing: string;
  layer_provider: string;
  time_create_layer: string;
  temporal_extent_end: string;
  temporal_extent_start: string;
};

export interface GetChangePointsByRegionsResType {
  resolution: string;
  labels: string[];
  data: number[];
}

export interface RegionChartBody {
  resolution: string;
  region: string;
}

export type CategoryResType = {
  id: string;
  name: string;
  description: string;
};

export type UpdateLayerBody = {
  id: string;
  category_id?: string;
  description?: string;
  layer_provider?: string;
  layer_type?: string;
  name?: string;
  service_type?: string;
  source_provider?: string;
  temporal_extent_end?: string;
  temporal_extent_start?: string;
  time_create_layer?: string | null;
  sharing?: string;
};

export interface ClassificationStatisticResType {
  labels: string[];
  stats: Record<number, number[]>;
}

export interface DetectObjectResType {
  labels: string[];
  data: {
    objectType: string;
    number: number;
  }[];
}

export const fetchLayerDetail = (layer_id: string): WrapperResponse<LayerDetailResType> =>
  clientGeoApi.get(`${GEO_API_GET_LAYER_DETAIL}?id=${layer_id}`);

export const fetchCategories = (type?: GROUP_LAYER_TYPE): WrapperResponse<CategoryResType[]> =>
  clientGeoApi.get(GEO_API_GET_CATEGORIES, {
    params: {
      type,
    },
  });

export const fetchLayersByField = (
  params: LayersByFieldRequestParams,
): WrapperResponse<LayerResType[]> =>
  clientGeoApi.get(GEO_API_GET_LAYER_BY_FIELD, {
    params,
  });

export const fetchDetectObjectMapData = (params: {
  satelliteImageId: string;
}): WrapperResponse<LayerResType> =>
  clientGeoApi.get(GEO_API_GET_DETECT_OBJECT_MAP_DATA, {
    params,
  });

export const fetchImagesInLayer = (data: FormData): WrapperResponse<ImagesInLayerResType> => {
  return clientGeoApi.post(GEO_API_GET_IMAGES_IN_LAYER, data, {});
};

export const compareLayers = (data: CompareLayerParams): WrapperResponse<CompareLayersResType> => {
  return clientGeoApi.get(
    `${GEO_API_COMPARE_LAYERS}?resolution=${data.resolution}&satelliteImageAfterId=${data.satelliteImageAfterId}&satelliteImageBeforeId=${data.satelliteImageBeforeId}`,
  );
};

export const downloadAIDetectObject = (id: string) => {
  return clientGeoApi.get(API_DOWNLOAD_DETECT_OBJECT, {
    params: {
      id,
    },
  });
};

export const getChangePointsByPolygons = (
  data: RegionChartBody,
): WrapperResponse<GetChangePointsByRegionsResType> => {
  return clientGeoApi.post(API_GET_CHANGE_POINTS_BY_POLYGONS, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchCompareLayerReport = (params: AIChangeDetectionParams) => {
  return clientGeoApi.get(GEO_API_REPORT_CHANGE, { params });
};

export const createLayer = (data: FormData) =>
  clientGeoApi.post(API_ADD_LAYER, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateLayer = (data: UpdateLayerBody) => clientGeoApi.post(API_UPDATE_LAYER, data);

export const removeLayer = (layerId: string) =>
  clientGeoApi.post(API_DELETE_LAYER, { layerId: layerId });

export const fetchClassificationStatistic = (): WrapperResponse<ClassificationStatisticResType> =>
  clientGeoApi.get(API_AI_CLASSIFICATION_STATISTIC);

export const fetchDetectObjectStatistic = (params: {
  satelliteImageId: string;
  layerId?: string;
}): WrapperResponse<DetectObjectResType> =>
  clientGeoApi.get(API_AI_GET_DETECT_OBJECT_STATISTIC, { params });

export const searchAddress = (searchValue: string): WrapperResponse<PinType[]> =>
  clientGeoApi.get(API_SEARCH_ADDRESS, {
    params: {
      searchValue,
    },
  });
