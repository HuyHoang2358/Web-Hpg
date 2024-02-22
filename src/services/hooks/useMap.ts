import { useMutation, useQuery } from '@tanstack/vue-query';
import type { ComputedRef, Ref } from 'vue';
import { fetchAIChangeDetectionResult, fetchImagesInMap } from '@/services/apis/map';
import { fetchCompareLayerReport } from '@/services/apis/layer';
export type CompareLayerParams = {
  resolution: string;
  satelliteImageAfterId: string;
  satelliteImageBeforeId: string;
};

const IMAGES_IN_MAP_QUERY_KEY = 'IMAGES_IN_MAP_QUERY_KEY';
const AI_CHANGE_DETECTION_RESULT_QUERY_KEY = 'AI_CHANGE_DETECTION_RESULT_QUERY_KEY';

// TODO: hook fetch images in map by mapId
export const useImagesInMap = (mapId: Ref<string>, enabled: ComputedRef<boolean>) => {
  return useQuery({
    queryKey: [IMAGES_IN_MAP_QUERY_KEY, mapId],
    queryFn: () => fetchImagesInMap(mapId.value),
    retry: 2,
    enabled,
  });
};

export const useAIChangeDetectionResult = () =>
  useMutation({
    mutationFn: (params: {
      resolution: string;
      satelliteImageBeforeId: string;
      satelliteImageAfterId: string;
    }) =>
      fetchAIChangeDetectionResult({
        resolution: params.resolution,
        satelliteImageBeforeId: params.satelliteImageBeforeId,
        satelliteImageAfterId: params.satelliteImageAfterId,
      }),
  });
