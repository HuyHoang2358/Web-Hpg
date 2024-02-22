import { useQuery } from '@tanstack/vue-query';
import { fetchPinsByProvince } from '@/services/apis/pin';
import type { ComputedRef } from 'vue';

export const GET_PINS_QUERY_KEY = 'GET_PINS_QUERY_KEY';

export const usePins = (enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [GET_PINS_QUERY_KEY],
    queryFn: fetchPinsByProvince,
    retry: 2,
    enabled,
  });
