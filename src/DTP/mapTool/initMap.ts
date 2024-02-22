import { onMounted } from 'vue';
import type { Ref } from 'vue';
import { Viewer, Cartesian3, Terrain, Ion } from 'cesium';
import { useViewerStore } from '@/stores/viewer';
import { defaultMapConfig } from '@/DTP/config';
import { leafletZoomToCesiumHeight } from '@/DTP/mapTool/camera';

export const useMountMap = (cesiumContainerRef: Ref) => {
  // const isMountedMap = ref(false);
  //
  // const isEnable = computed(() => isMountedMap.value);
  //
  // const { data, refetch, isSuccess } = usePins(isEnable);
  //
  // watch(data, () => {
  //   if (isSuccess) {
  //     addPin(data?.value?.data || []);
  //   }
  // });

  Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOGMyYzMzYy1mMTUyLTQ1M2ItOTRjMC05ZmFmY2M0M2NjMzMiLCJpZCI6MTgxOTA4LCJpYXQiOjE3MDcxMjQ1NDZ9.x8aQMs81bHm8ZvhnguZV0I0Z1cbvG4NSpJrbLElha1Y';

  onMounted(async () => {
    if (cesiumContainerRef.value !== null) {
      const viewer = new Viewer(cesiumContainerRef.value, {
        selectionIndicator: false,
        infoBox: false,
        baseLayerPicker: false,
        // baseLayer: false,
        terrain: Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        scene3DOnly: false,
      });

      // viewer.scene.morphTo2D(0);

      const haiPhongCoordinates = Cartesian3.fromDegrees(
        defaultMapConfig.centerPoint.lng,
        defaultMapConfig.centerPoint.lat,
        leafletZoomToCesiumHeight(11),
      );

      // Đặt camera tới tọa độ Hải Phòng trong map 2D
      viewer.camera.setView({
        destination: haiPhongCoordinates,
        // orientation: {
        //   heading: Math.toRadians(0.0), // Góc quay của camera
        //   pitch: Math.toRadians(-90.0), // Góc nghiêng của camera, -90 để ở chế độ 2D
        //   roll: 0.0, // Góc quay xung quanh trục chéo
        // },
      });

      // const right = await createOsmBuildingsAsync();

      // viewer.scene.primitives.add(right);
      const mapStore = useViewerStore();
      mapStore.viewer = viewer;
    }

    // refetch();
  });
};
