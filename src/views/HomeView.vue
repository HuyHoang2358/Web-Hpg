<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.darkAlgorithm,
    }"
  >
    <div
      class="flex h-screen w-screen dark-form"
      id="main-app"
    >
      <HeaderApp />
      <MapTool />
      <DetectObjectQuery />
      <LayersDisplayed />
      <DetectChangeQuery v-if="mapToolStore.activeFunction === ACTIVE_FUNCTION.DETECT_CHANGE" />
      <MapView />
      <EntityInfo />
      <div class="absolute bottom-0">
        <BottomHome />
      </div>
      <ModalHandleBookmark />
      <ModalHandleCaringArea />
      <ModalHandleProfile v-if="configStore?.profile" />
      <ModalHandleChangePassword v-if="configStore?.profile" />
      <ModalSetting v-if="configStore?.profile" />
      <div
        class="absolute"
        style="bottom: 185px; left: 0px"
        v-if="mapToolStore.isShowBottom"
      >
        <p class="text-white bg-[#151515] bg-opacity-90 px-4 py-2">
          @ Viettel Digital Twin Platform
        </p>
      </div>
      <div
        class="absolute"
        style="bottom: 217px; right: 313px; width: 283px"
        v-if="compareMapStore.isShowOpacity"
      >
        <a-slider
          v-model:value="opacity"
          :marks="marks"
          class="mx-5"
          @change="onChangeSlider"
        >
          <template #mark="{ label, point }">
            <template v-if="point === 100">
              <strong>{{ label }}</strong>
            </template>
            <template v-else>{{ label }}</template>
          </template>
        </a-slider>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import HeaderApp from '@/components/home/header/HeaderApp.vue';
import MapView from '@/components/home/map/MapView.vue';
import LayersDisplayed from '@/components/home/LayersDisplayed.vue';
import ModalHandleBookmark from '@/components/home/modals/ModalHandleBookmark.vue';
import ModalHandleCaringArea from '@/components/home/modals/ModalHandleCaringArea.vue';
import { computed, type ComputedRef, type CSSProperties, onUnmounted, ref, watch } from 'vue';
import { notification, theme } from 'ant-design-vue';
import { keyNotificationMap } from '@/utils/constants';
import MapTool from '@/components/home/sections/MapTool.vue';
import { useProfile } from '@/services/hooks/useSystem';
import { useConfigStore } from '@/stores/config';
import ModalHandleProfile from '@/components/home/modals/ModalHandleProfile.vue';
import ModalHandleChangePassword from '@/components/home/modals/ModalHandleChangePassword.vue';
import ModalSetting from '@/components/home/modals/ModalSetting.vue';
import DetectChangeQuery from '@/components/home/right/DetectChangeQuery.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { ACTIVE_FUNCTION } from '@/utils/enums';
import BottomHome from '@/components/home/bottom/BottomHome.vue';
import DetectObjectQuery from '@/components/home/right/DetectObjectQuery.vue';
import EntityInfo from '@/components/home/EntityInfo.vue';
import { changeOpacityOfTopLayers } from '@/DTP_new/modules/imageryLayer';
import { useCompareMapStore } from '@/stores/compareMapStore';

const mapToolStore = useMapToolStore();
const configStore = useConfigStore();

const isEnableProfile = computed(() => !!configStore.accessToken);

const { data: profileData } = useProfile(isEnableProfile);

watch(profileData, () => {
  configStore.setProfile(profileData.value?.data);
});

onUnmounted(() => {
  notification.close(keyNotificationMap);
});

// TODO:
const opacity = ref<number>(25);
const marks = ref<Record<number, string>>({
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
});

const onChangeSlider = (opacityValue: number) => {
  changeOpacityOfTopLayers(opacityValue);
};
const compareMapStore = useCompareMapStore();
/*watch(
  () => compareMapStore.isShowOpacity,
  () => {
    opacity.value = 25;
    changeOpacityOfTopLayers(opacity.value);
  },
);*/
</script>
