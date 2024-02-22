import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  compareLayers,
  createLayer,
  removeLayer,
  fetchCategories,
  fetchImagesInLayer,
  fetchLayerDetail,
  fetchLayersByField,
  getChangePointsByPolygons,
  fetchClassificationStatistic,
  updateLayer,
  searchAddress,
  fetchDetectObjectStatistic,
  fetchDetectObjectMapData,
} from '@/services/apis/layer';
import type { ComputedRef, Ref } from 'vue';
import type { GROUP_LAYER_TYPE } from '@/utils/enums';

export const FIELDS_QUERY_KEY = 'FIELDS_QUERY_KEY';
export const SEARCH_ADDRESS_QUERY_KEY = 'SEARCH_ADDRESS_QUERY_KEY';
export const LAYERS_QUERY_KEY = 'LAYERS_QUERY_KEY';
export const LAYERS_DETAIL_QUERY_KEY = 'LAYERS_DETAIL_QUERY_KEY';
export const LAYERS_BY_GROUP_QUERY_KEY = 'LAYERS_BY_GROUP_QUERY_KEY';
export const LAYERS_BY_CATEGORY_QUERY_KEY = 'LAYERS_BY_CATEGORY_QUERY_KEY';
export const SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY = 'SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY';
export const IMAGES_IN_LAYER_QUERY_KEY = 'IMAGES_IN_LAYER_QUERY_KEY';

export type ImagesInLayerRequestParams = {
  layerId: Ref<string>;
  region?: Ref<string>;
};

export type LayersByCategoryRequestParams = {
  categoryId: Ref<string>;
  resolution?: Ref<string>;
};
export type LayersByFieldRequestParams = {
  unitId: Ref<string>;
};

export const useLayerDetail = (layer_id: Ref<string>, enable: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [LAYERS_DETAIL_QUERY_KEY, layer_id.value],
    queryFn: () => fetchLayerDetail(layer_id.value),
    retry: 2,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: enable,
  });

export const useCategoriesInUnit = (type?: GROUP_LAYER_TYPE) =>
  useQuery({
    queryKey: [FIELDS_QUERY_KEY, type],
    queryFn: () => fetchCategories(type),
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useLayersByCategory = (type?: GROUP_LAYER_TYPE) =>
  useQuery({
    queryKey: [FIELDS_QUERY_KEY, type],
    queryFn: () => fetchCategories(type),
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useDetectObjectMapData = () => useMutation({ mutationFn: fetchDetectObjectMapData });

export const useClassification = () => useMutation({ mutationFn: fetchClassificationStatistic });
export const useDetectObjectStatistic = () =>
  useMutation({ mutationFn: fetchDetectObjectStatistic });

export const useMapsByUnit = (params: LayersByFieldRequestParams, enable: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [SPECIALIZE_LAYERS_BY_GROUP_QUERY_KEY, params],
    queryFn: () => fetchLayersByField({ unitId: params.unitId.value }),
    retry: 2,
    enabled: enable,
  });

export const useImagesInLayer = (params: ImagesInLayerRequestParams) => {
  return useQuery({
    queryKey: [IMAGES_IN_LAYER_QUERY_KEY, params],
    queryFn: () => {
      const formData = new FormData();
      formData.append('size', '10');
      formData.append('page', '0');
      formData.append('layerId', params.layerId.value);
      params?.region?.value && formData.append('region', params?.region?.value);

      return fetchImagesInLayer(formData);
    },
    retry: 2,
  });
};

export const useAddNewLayer = () => useMutation({ mutationFn: createLayer });
export const useUpdateLayer = () => useMutation({ mutationFn: updateLayer });

export const useFetchLayerDetail = () => useMutation({ mutationFn: fetchLayerDetail });

export const useRemoveLayer = () => useMutation({ mutationFn: removeLayer });

export const useSearchAddress = (searchValue: Ref<string>) =>
  useQuery({
    queryKey: [SEARCH_ADDRESS_QUERY_KEY, searchValue.value],
    queryFn: () => searchAddress(searchValue.value),
    retry: 2,
  });

export const useCompareLayers = () => useMutation({ mutationFn: compareLayers });

export const useGetChangePointsByPolygons = () =>
  useMutation({ mutationFn: getChangePointsByPolygons });
