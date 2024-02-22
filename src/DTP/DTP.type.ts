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

/*export type LayerType = LayerResType & {
  entity: L.GridLayer;
};*/

/*export interface Options {
  layers?: string;
  subdomains?: string | string[];
  zIndex?: number;
  minZoom?: number;
}*/
/*
export type PointType = {
  lat: number;
  lng: number;
  entity?: L.Marker;
};*/

export enum POLYGON_STATUS {
  DELETED = 'DELETED',
  DRAWING = 'DRAWING',
  COMPLETE = 'COMPLETE',
  SAVED = 'SAVED',
}

export enum POLY_TYPE {
  POLYGON = 'polygon',
  POLYLINE = 'polyline',
}
/*
export type PolygonType = {
  polygon?: L.Polygon;
  markerPolygon?: L.Marker;
  points?: PointType[];
  status: POLYGON_STATUS;
  name?: string;
  id?: string;
  polygonIndex?: number;
  area?: string;
  updateTime?: number;
  type?: POLY_TYPE;
};*/

/*
export type PolylineType = {
  polyline?: L.Polyline;
  polylineLength?: number;
  status: POLYGON_STATUS;
  points?: PointType[];
  label?: L.Marker;
  polylineIndex?: number;
  updateTime?: number;
  type?: POLY_TYPE;
};
*/

export interface GeoJsonFile {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Properties {}

export interface Geometry {
  coordinates: number[][][];
  type: string;
}

export type OptionType = {
  label: string;
  value: string;
};
