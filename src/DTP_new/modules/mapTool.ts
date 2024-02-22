import { Fullscreen } from 'cesium';
import { useMapToolStore } from '@/stores/mapTool';

export function turnOnFullscreenMode() {
  const mapToolStore = useMapToolStore();
  mapToolStore.isFullscreenModel = true;
  Fullscreen.requestFullscreen(document.body);
}

export function turnOffFullscreenMode() {
  const mapToolStore = useMapToolStore();
  mapToolStore.isFullscreenModel = false;
  Fullscreen.exitFullscreen();
}
