import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ACTIVE_FUNCTION, ICON_TOOL_ACTIVE } from '@/utils/enums';
import { activeKeyBottomHome } from '@/utils/constants';
import type { BookmarkListResType } from '@/services/apis/map';
import type { DetectObjectResType } from '@/services/apis/layer';

export type ModalHandleCaringAreaMode = 'create' | 'edit';

export const useMapToolStore = defineStore('mapTool', () => {
  const iconToolActive = ref<ICON_TOOL_ACTIVE | undefined>(undefined);
  const isFullscreenModel = ref<Boolean>(false);
  const isShowModalHandleBookmark = ref<boolean>(false);
  const dataModalHandleBookmark = ref<BookmarkListResType>();
  const isShowModalHandleCaringArea = ref<boolean>(false);
  const isNeedToDrawPolygon = ref<boolean>(false);
  const polygonHandleIndex = ref<number>(-1);
  const modalHandleCaringAreaMode = ref<ModalHandleCaringAreaMode>();
  const activeKeyBottomCollapse = ref([activeKeyBottomHome]);
  const activeAreaIds = ref<string[]>([]);
  const activeFunction = ref<ACTIVE_FUNCTION>(ACTIVE_FUNCTION.DEFAULT);
  const isShowDetectChangeQuery = ref(false);
  const isShowDetectObjectQuery = ref(false);
  const periodId1 = ref('');
  const time1 = ref('');
  const periodId2 = ref('');
  const time2 = ref('');
  const isShowImageryLayersSplit = ref(false);
  const isShowButtonAIDetectChange = ref(false);
  const isShowAIDetectChangeResult = ref(false);
  const isShowAIDetectObjectResult = ref(false);
  const dataDetectChangeChart = ref<Record<string, number>>({});
  const selectedUnit = ref('');
  const detectObjectStatisticData = ref<DetectObjectResType>();

  function showPeriod1(period1Cb?: string, timeCb1?: string) {
    periodId1.value = period1Cb || '';
    time1.value = timeCb1 || '';
  }

  const isShowBottom = computed(() => activeKeyBottomCollapse.value.length > 0);

  function removeActiveAreaId(id: string) {
    activeAreaIds.value = activeAreaIds.value.filter((i) => i !== id);
  }

  function setPolygonHandleIndex(id: number) {
    polygonHandleIndex.value = id;
  }

  function changeActiveTool(value?: ICON_TOOL_ACTIVE) {
    iconToolActive.value = value;
  }

  function showModalHandleBookmark(formData?: BookmarkListResType) {
    isShowModalHandleBookmark.value = true;
    dataModalHandleBookmark.value = formData;
  }

  function hideModalHandleBookmark() {
    isShowModalHandleBookmark.value = false;
    dataModalHandleBookmark.value = undefined;
  }

  function showModalHandleCaringArea({ mode }: { mode?: ModalHandleCaringAreaMode }) {
    isShowModalHandleCaringArea.value = true;
    modalHandleCaringAreaMode.value = mode;
  }

  function hideModalHandleCaringArea() {
    isShowModalHandleCaringArea.value = false;
  }

  function showBottomHome() {
    activeKeyBottomCollapse.value = [activeKeyBottomHome];
  }

  function hideBottomHome() {
    activeKeyBottomCollapse.value = [];
  }

  return {
    iconToolActive,
    changeActiveTool,
    isShowModalHandleBookmark,
    dataModalHandleBookmark,
    showModalHandleBookmark,
    hideModalHandleBookmark,
    isShowModalHandleCaringArea,
    showModalHandleCaringArea,
    hideModalHandleCaringArea,
    isFullscreenModel,
    showBottomHome,
    hideBottomHome,
    activeKeyBottomCollapse,
    isShowBottom,
    modalHandleCaringAreaMode,
    polygonHandleIndex,
    activeAreaIds,
    removeActiveAreaId,
    setPolygonHandleIndex,
    isNeedToDrawPolygon,
    activeFunction,
    isShowDetectChangeQuery,
    periodId1,
    time1,
    time2,
    periodId2,
    showPeriod1,
    isShowImageryLayersSplit,
    isShowButtonAIDetectChange,
    isShowAIDetectChangeResult,
    dataDetectChangeChart,
    isShowDetectObjectQuery,
    selectedUnit,
    isShowAIDetectObjectResult,
    detectObjectStatisticData,
  };
});
