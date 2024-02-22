import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  createBookmark,
  createCaringArea,
  deleteBookmark,
  deleteCaringArea,
  deleteLocation,
  editBookmark,
  editCaringArea,
  fetchBookmarkList,
  fetchCaringArea,
  fetchLocations,
} from '@/services/apis/map';
import type { ComputedRef } from 'vue';

export const BOOKMARK_LIST_QUERY_KEY = 'BOOKMARK_LIST_QUERY_KEY';

export const LOCATIONS_QUERY_KEY = 'LOCATION_QUERY_KEY';
export const CARING_AREA_QUERY_KEY = 'CARING_AREA_QUERY_KEY';

export const useBookmarkList = () =>
  useQuery({
    queryKey: [BOOKMARK_LIST_QUERY_KEY],
    queryFn: fetchBookmarkList,
    retry: 2,
  });

export const useLocations = (idBookmark: string, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, idBookmark],
    queryFn: () => fetchLocations(idBookmark),
    retry: 2,
    enabled,
  });

export const useEditBookmark = () => useMutation({ mutationFn: editBookmark });

export const useCreateBookmark = () => useMutation({ mutationFn: createBookmark });

export const useCreateCaringArea = () => useMutation({ mutationFn: createCaringArea });

export const useDeleteLocation = () => useMutation({ mutationFn: deleteLocation });

export const useDeleteBookmark = () => useMutation({ mutationFn: deleteBookmark });

export const useDeleteCaringArea = () => useMutation({ mutationFn: deleteCaringArea });
export const useEditCaringArea = () => useMutation({ mutationFn: editCaringArea });

export const useCaring = () =>
  useQuery({
    queryKey: [CARING_AREA_QUERY_KEY],
    queryFn: fetchCaringArea,
    retry: 2,
    refetchOnWindowFocus: false,
  });
