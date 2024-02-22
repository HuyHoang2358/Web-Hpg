import type { ClickSceneMode, SceneMode } from '@/DTP_new/libs/DTP.type';
export const DEBUG_MODE = true;
export const HIDDEN_HTML_EL_CLASSES: string[] = [
  'cesium-viewer-fullscreenContainer',
  'cesium-viewer-animationContainer',
  'cesium-viewer-toolbar',
];
export const CESIUM_ION_TOKEN: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjJmMDA2NC0yY2YyLTRkOGEtOGVmYi03YmNmZmE1NzcyY2MiLCJpZCI6ODk3NzUsImlhdCI6MTY0OTkyNTEwMX0.VPFCxddX_V2UKjOJeqJszZ25c9z4HA2BSYimPLYrbWo';

export const CESIUM_SCENE_MODES: SceneMode[] = [
  { id: '3D', name: '3D' },
  { id: '2D', name: '2D' },
  /* { id: '4D', name: '4D' },*/
];
export const CESIUM_CLICK_SCENE_MODES: ClickSceneMode[] = [
  { id: 'pickEntity', name: 'pickEntity' },
  { id: 'getFeature', name: 'getFeature' },
];

export const CAMERA_AMOUNT_METE_ZOOM = 100;
