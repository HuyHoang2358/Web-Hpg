import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { LayerType, PointType, PolygonType, PolylineType } from '@/DTP/DTP.type';
import { POLYGON_STATUS } from '@/DTP/DTP.type';
import { getUnixMilliseconds, insert } from '@/DTP/common';
import type {
  ChangeInformation,
  ClassificationStatisticResType,
  DetectObjectResType,
  GetChangePointsByRegionsResType,
} from '@/services/apis/layer';
import { Viewer } from 'cesium';

export const useMapStore = defineStore('originalMap', () => {
  const originalMap = ref<Viewer>();
  const layerGroupsImages = ref<L.LayerGroup>();
  const baseMap = ref<L.Layer>();
  const layers = ref<LayerType[]>([]);
  const tempPoint = ref<L.Marker>();
  const polygons = ref<PolygonType[]>([]);
  const polygonIndex = ref<number>(-1);
  const polylines = ref<PolylineType[]>([]);
  const polylineIndex = ref<number>(-1);
  const tempPolygon = ref<L.Polygon>();
  const tempPolyline = ref<L.Polyline>();
  const compareMap = ref<Viewer>();
  const sideBySideMap = ref<L.Control.SideBySide>();
  const isShowCompareMap = ref(false);
  const isRasterMap = ref(true);
  const isShowAIResultChart = ref(false);
  const isShowAIResult = ref(false);
  const isShowRegionChart = ref(false);
  const isDisplayCoating = ref(false);
  const isShowDetectObjectChart = ref(false);
  const dataRegionChart = ref<GetChangePointsByRegionsResType>();
  const periodId1 = ref('');
  const time1 = ref('');
  const periodId2 = ref('');
  const time2 = ref('');
  const changePoints = ref<any>();
  const initialChangeInformation = ref<ChangeInformation[]>();
  const currentChangeInformation = ref<ChangeInformation[]>();
  const classificationStatistic = ref<ClassificationStatisticResType>();
  const detectObjectStatisticData = ref<DetectObjectResType>();
  const isFunctionBlocked = ref<boolean>(false);
  const map = computed(() => (isShowCompareMap.value ? compareMap.value : originalMap.value));

  const isShouldBackDetectChange = computed(
    () => !(isShowCompareMap.value && !isShowAIResult.value),
  );

  const isHaveRegionOnMap = computed(() =>
    polygons.value.find(
      (i) => i.status === POLYGON_STATUS.COMPLETE || i.status === POLYGON_STATUS.SAVED,
    ),
  );

  function setClassificationStatistic(newValue: ClassificationStatisticResType) {
    classificationStatistic.value = newValue;
  }

  function setChangePoints(value?: any) {
    changePoints.value = value;
  }
  function setInitialChangeInformation(value?: ChangeInformation[]) {
    initialChangeInformation.value = value;
  }

  function setOriginMap(value?: Viewer) {
    originalMap.value = value;
  }

  function setCompareMap(value?: L.Map) {
    compareMap.value = value;
  }

  function setSideBySideMap(originalMap: L.Control.SideBySide) {
    sideBySideMap.value = originalMap;
  }

  function resetSideBySideMap() {
    sideBySideMap.value = undefined;
  }

  function setTempPolyline(value: L.Polyline) {
    tempPolyline.value = value;
  }

  function setBaseMap(value?: L.Layer) {
    baseMap.value = value;
  }

  function addLayer(value: LayerType) {
    layers.value = layers.value.concat([value]);
  }

  function removeLayer(id: string) {
    const currentLayer = layers.value.find((i) => i.id === id);
    layers.value = layers.value.filter((i) => i.id !== id);
    return currentLayer;
  }

  function removeAllLayers() {
    layers.value = [];
  }

  function addPolygon(value: PolygonType) {
    polygons.value.push(value);
    polygonIndex.value += 1;
  }

  function addPolygonPoint(polygonIndex: number, point: PointType) {
    polygons.value = polygons.value.map((p, i) => {
      if (i === polygonIndex) {
        return {
          ...p,
          points: (p?.points || []).concat([point]),
        };
      } else return p;
    });
  }

  function addPolylinePoint(polylineIndex: number, point: PointType) {
    polylines.value = polylines.value.map((p, i) => {
      if (i === polylineIndex) {
        return {
          ...p,
          points: (p?.points || []).concat([point]),
        };
      } else return p;
    });
  }

  function addPointWithIndex(polygonIndex: number, point: PointType, index: number) {
    polygons.value = polygons.value.map((p, i) => {
      if (i === polygonIndex) {
        return {
          ...p,
          points: insert(p?.points || [], index, point),
        };
      } else return p;
    });
  }

  function removePoint(polygonIndex: number, index: number) {
    polygons.value = polygons.value.map((p, i) => {
      if (i === polygonIndex) {
        (p?.points || [])[index].entity?.remove();
        return {
          ...p,
          points: p.points?.filter((_p, _i) => _i !== index),
        };
      } else return p;
    });
  }

  const getPolygonPoints = (polygonIndex: number) => polygons.value[polygonIndex]?.points || [];
  const getPolylinePoints = (polylineIndex: number) => polylines.value[polylineIndex]?.points || [];

  const getPolygonPointsLength = (polygonIndex: number) =>
    polygons.value[polygonIndex]?.points?.length || 0;
  const getPolylinePointsLength = (polylineIndex: number) =>
    polylines.value[polylineIndex]?.points?.length || 0;

  function updatePolygon(polygonIndex: number, value?: L.Polygon) {
    polygons.value = polygons.value.map((p, i) => {
      if (polygonIndex === i) {
        return {
          ...p,
          polygon: value,
          status:
            p.status === POLYGON_STATUS.SAVED ? POLYGON_STATUS.SAVED : POLYGON_STATUS.COMPLETE,
          updateTime: getUnixMilliseconds(),
        };
      } else return p;
    });
  }

  function updatePolyline(
    polylineIndex: number,
    value: { polyline: L.Polyline; polylineLength: number; label?: L.Marker },
  ) {
    polylines.value = polylines.value.map((p, i) => {
      if (polylineIndex === i) {
        return {
          ...p,
          polyline: value.polyline,
          polylineLength: value.polylineLength,
          status: POLYGON_STATUS.COMPLETE,
          label: value.label,
          updateTime: getUnixMilliseconds(),
        };
      } else return p;
    });
  }

  function updatePolygonWhenSave(polygonIndex: number, value?: { name?: string; id?: string }) {
    polygons.value = polygons.value.map((p, i) => {
      if (polygonIndex === i) {
        return {
          ...p,
          name: value?.name,
          id: value?.id,
          status: POLYGON_STATUS.SAVED,
          updateTime: getUnixMilliseconds(),
        };
      } else return p;
    });
  }

  function updateMarker(polygonIndex: number, value?: L.Marker) {
    polygons.value[polygonIndex].markerPolygon = value;
  }

  function getMarker(polygonIndex: number) {
    return polygons.value[polygonIndex]?.markerPolygon;
  }

  function getPolygon(polygonIndex: number) {
    return polygons.value[polygonIndex]?.polygon;
  }

  function getPolygonStatus(polygonIndex: number) {
    return polygons.value[polygonIndex]?.status;
  }

  function getPolygonId(polygonIndex: number) {
    return polygons.value[polygonIndex]?.id;
  }

  function removePolygonItem(polygonIndex: number) {
    polygons.value[polygonIndex]?.points?.forEach((point) => point.entity?.remove());
    polygons.value[polygonIndex]?.polygon?.remove();
    polygons.value[polygonIndex]?.markerPolygon?.remove();

    polygons.value = polygons.value.map((p, i) => {
      if (polygonIndex === i) {
        return {
          ...p,
          status: POLYGON_STATUS.DELETED,
        };
      } else return p;
    });
  }

  function removePolylineItem(polylineIndex: number) {
    polylines.value[polylineIndex]?.points?.forEach((point) => point.entity?.remove());
    polylines.value[polylineIndex]?.polyline?.remove();
    polylines.value[polylineIndex]?.label?.remove();

    polylines.value = polylines.value.map((p, i) => {
      if (polylineIndex === i) {
        return {
          ...p,
          status: POLYGON_STATUS.DELETED,
        };
      } else return p;
    });
  }

  function removeAllPolygons() {
    const arr = Array.from(polygons.value);
    arr.forEach((i, index) => {
      removePolygonItem(index);
    });
  }

  function completeDrawPolygon() {
    tempPolygon.value?.remove();
    tempPoint.value?.remove();

    tempPoint.value = undefined;
    tempPolygon.value = undefined;
  }

  function setTempPoint(value: L.Marker) {
    tempPoint.value = value;
  }

  function setTempPolygon(value: L.Polygon) {
    tempPolygon.value = value;
  }

  function addPolyline(value: PolylineType) {
    polylines.value.push(value);
    polylineIndex.value += 1;
  }

  function completeDrawPolyline() {
    tempPolyline.value?.remove();
    tempPoint.value?.remove();

    tempPolyline.value = undefined;
    tempPoint.value = undefined;
  }

  function showCompareMap(
    period1Cb?: string,
    timeCb1?: string,
    period2Cb?: string,
    timeCb2?: string,
  ) {
    isShowCompareMap.value = true;
    periodId1.value = period1Cb || '';
    time1.value = timeCb1 || '';
    periodId2.value = period2Cb || '';
    time2.value = timeCb2 || '';
  }

  function showPeriod1(period1Cb?: string, timeCb1?: string) {
    periodId1.value = period1Cb || '';
    time1.value = timeCb1 || '';
  }

  function closeAIResultChart() {
    isShowAIResultChart.value = false;
  }

  function closeCoatingChart() {
    isDisplayCoating.value = false;
  }

  function showAIResultChart() {
    isShowAIResultChart.value = true;
    isShowAIResult.value = true;
  }

  function displayCoating() {
    isDisplayCoating.value = true;
  }

  function closeRegionChart() {
    isShowRegionChart.value = false;
  }

  function showDetectObjectChart(chartData: DetectObjectResType) {
    isShowDetectObjectChart.value = true;
    detectObjectStatisticData.value = chartData;
  }

  function closeDetectObjectChart() {
    isShowDetectObjectChart.value = false;
  }

  function showRegionChart(data: GetChangePointsByRegionsResType) {
    if (isShowAIResultChart.value) {
      closeAIResultChart();
      sideBySideMap?.value?._resetSize();
    }
    dataRegionChart.value = data;
    isShowRegionChart.value = true;
  }

  function closeCompareMap() {
    isShowCompareMap.value = false;
    isShowAIResult.value = false;
  }

  return {
    map,
    originalMap,
    setOriginMap,
    baseMap,
    setBaseMap,
    layers,
    addLayer,
    removeLayer,
    removeAllLayers,
    addPolygonPoint,
    tempPoint,
    setTempPoint,
    tempPolygon,
    setTempPolygon,
    completeDrawPolygon,
    setSideBySideMap,
    resetSideBySideMap,
    sideBySideMap,
    setCompareMap,
    compareMap,
    isShowCompareMap,
    showCompareMap,
    closeCompareMap,
    showPeriod1,
    periodId1,
    periodId2,
    time1,
    time2,
    isShowAIResultChart,
    isDisplayCoating,
    closeAIResultChart,
    closeCoatingChart,
    displayCoating,
    isRasterMap,
    showAIResultChart,
    changePoints,
    setChangePoints,
    addPolygon,
    polygons,
    polygonIndex,
    updatePolygon,
    removePolygonItem,
    removeAllPolygons,
    removePoint,
    addPointWithIndex,
    getPolygonPoints,
    getPolygonPointsLength,
    getPolygon,
    updateMarker,
    getMarker,
    updatePolygonWhenSave,
    getPolygonStatus,
    getPolygonId,
    isShowRegionChart,
    closeRegionChart,
    showRegionChart,
    dataRegionChart,
    initialChangeInformation,
    setInitialChangeInformation,
    isHaveRegionOnMap,
    addPolyline,
    completeDrawPolyline,
    tempPolyline,
    setTempPolyline,
    addPolylinePoint,
    getPolylinePoints,
    getPolylinePointsLength,
    polylineIndex,
    updatePolyline,
    polylines,
    removePolylineItem,
    classificationStatistic,
    setClassificationStatistic,
    currentChangeInformation,
    layerGroupsImages,
    isFunctionBlocked,
    isShowDetectObjectChart,
    showDetectObjectChart,
    closeDetectObjectChart,
    detectObjectStatisticData,
    isShouldBackDetectChange,
  };
});
