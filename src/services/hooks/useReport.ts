import { useMutation } from '@tanstack/vue-query';
import { fetchCompareLayerReport } from '@/services/apis/layer';

export const useAIDetectChangeReport = () =>
  useMutation({
    mutationFn: (params: {
      resolution: string;
      satelliteImageBeforeId: string;
      satelliteImageAfterId: string;
      layerId?: string;
    }) => fetchCompareLayerReport(params),
  });
