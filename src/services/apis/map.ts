import type { PinType, WrapperResponse } from '@/services/commonTypes';
import clientGeoApi from '@/services/clientGeoApi';
import {
  API_ADD_TO_BOOKMARK_LIST,
  API_AI_CHANGE_DETECTION_RESULT,
  API_BOOKMARK_LIST,
  API_CARING_AREA,
  API_CREATE_AREA,
  API_CREATE_BOOKMARK,
  API_DELETE_AREA,
  API_DELETE_BOOKMARK,
  API_DELETE_SAVED_BOOKMARK,
  API_DETECT_OBJECT,
  API_EDIT_AREA,
  API_LOCATIONS,
  API_UPDATE_BOOKMARK,
  GEO_API_GET_IMAGES_IN_MAP,
} from '@/utils/apiPath';

import axios from 'axios';
import type { LayerResType } from '@/DTP/DTP.type';

export type BookmarkListResType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  bookmarkName: string;
  userId: string;
};

export type CaringAreaResType = {
  boundary: string;
  code: string;
  createdBy: string;
  createdDate: string;
  description: string;
  end_valid_date: string;
  id: string;
  level: number;
  name: string;
  parent_id: string;
  start_valid_date: string;
  updatedBy: string;
  updatedDate: string;
  userId: string;
  area: string;
};

export type BookmarkListRequestBody = {
  bookmarkName: string;
  id: string;
};

export interface Boundary {
  type: string;
  coordinates: number[][][];
}

export interface Attributes {
  code: string;
  description: string;
  end_valid_date: string;
  level: number;
  name: string;
  parent_id: string;
  start_valid_date: string;
  user_id: string;
  area: string;
}

export type WMSParams = {
  SERVICE: string;
  VERSION: string;
  REQUEST: string;
  FORMAT: string;
  TRANSPARENT: boolean;
  QUERY_LAYERS: string;
  STYLES: string;
  LAYERS: string;
  exceptions: string;
  INFO_FORMAT: string;
  FEATURE_COUNT: number;
  SRS: string;
  WIDTH: number;
  HEIGHT: number;
  X: number;
  Y: number;
  info_format: string;
  BBOX: string;
};

export interface ObjectDetectResType {
  type: string;
  features: Feature[];
  totalFeatures: string;
  numberReturned: number;
  timeStamp: string;
  crs: Crs;
}

export interface Feature {
  type: string;
  id: string;
  geometry: Geometry;
  geometry_name: string;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface Properties {
  area: string;
  commune: string;
  district: string;
  latitude: string;
  layer_id: string;
  location_on_image: string;
  longitude: string;
  province: string;
  satellite_image_id: string;
  time_period: string;
  uuid: string;
}

export interface Crs {
  type: string;
  properties: Properties2;
}

export interface Properties2 {
  name: string;
}

export interface BoundingBox {
  type: string;
  coordinates: number[][][];
}

export type ImagesInMapResType = {
  id: string;
  fileName: string;
  fullPathUrl: string;
  boundingBox: BoundingBox;
};

export type AIChangeDetectionParams = {
  resolution: string;
  satelliteImageBeforeId: string;
  satelliteImageAfterId: string;
  layerId?: string;
};
export const fetchBookmarkList = (): WrapperResponse<BookmarkListResType[]> =>
  clientGeoApi.get(API_BOOKMARK_LIST);

export const saveBookmarkList = (data: { addressId: string; bookmarkId: string }) =>
  clientGeoApi.post(API_ADD_TO_BOOKMARK_LIST, data);

export const fetchCaringArea = (): WrapperResponse<CaringAreaResType[]> =>
  clientGeoApi.get(API_CARING_AREA);

export const editBookmark = (data: BookmarkListRequestBody) =>
  clientGeoApi.put(API_UPDATE_BOOKMARK, data);

export const editCaringArea = (data: FormData) =>
  clientGeoApi.post(API_EDIT_AREA, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const createBookmark = (data: Omit<BookmarkListRequestBody, 'id'>) =>
  clientGeoApi.post(API_CREATE_BOOKMARK, data);

export const deleteBookmark = (id: string) =>
  clientGeoApi.delete(API_DELETE_BOOKMARK, {
    params: {
      bookmarkId: id,
    },
  });

export const deleteLocation = ({ bookmarkId, id }: { bookmarkId: string; id: string }) =>
  clientGeoApi.delete(`${API_DELETE_SAVED_BOOKMARK}/${bookmarkId}`, {
    params: {
      addressId: id,
      bookmarkId,
    },
  });

export const fetchLocations = (bookmarkId: string): WrapperResponse<PinType[]> =>
  clientGeoApi.get(`${API_LOCATIONS}/${bookmarkId}`);

export const deleteCaringArea = (id: string) =>
  clientGeoApi.delete(API_DELETE_AREA, {
    params: {
      id,
    },
  });

export const createCaringArea = (data: FormData): WrapperResponse<CaringAreaResType> =>
  clientGeoApi.post(API_CREATE_AREA, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const objectDetect = (params: WMSParams): WrapperResponse<ObjectDetectResType> =>
  axios.get(API_DETECT_OBJECT, {
    params,
  });

export const fetchImagesInMap = (mapId: string): WrapperResponse<ImagesInMapResType[]> => {
  return clientGeoApi.get(`${GEO_API_GET_IMAGES_IN_MAP}?mapId=${mapId}`);
};

export const fetchAIChangeDetectionResult = (
  params: AIChangeDetectionParams,
): WrapperResponse<LayerResType> => {
  return clientGeoApi.get(API_AI_CHANGE_DETECTION_RESULT, { params });
};
