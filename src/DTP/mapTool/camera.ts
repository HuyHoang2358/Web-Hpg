import { useViewerStore } from '@/stores/viewer';
import { BoundingSphere } from 'cesium';

export function moveToLocation() {}

export function mapZoomIn() {
  const viewerStore = useViewerStore();
  viewerStore.viewer?.camera.zoomIn();
}

export function mapZoomOut() {
  const viewerStore = useViewerStore();
  viewerStore.viewer?.camera.zoomOut();
}

export async function fullScreen(elementID: string) {
  const elementHTML = document.getElementById(elementID);
  if (elementHTML?.requestFullscreen) {
    // Trình duyệt hỗ trợ API Fullscreen
    if (document.fullscreenElement) {
      // Nếu Yang ở chế độ fullscreen, tắt nó
      await document.exitFullscreen();
    } else {
      // Nếu không ở chế độ fullscreen, bật fullscreen cho phần tử chứa bản đồ
      await elementHTML.requestFullscreen();
    }
  } else {
    // Trình duyệt không hỗ trợ API Fullscreen
    alert('Trình duyệt của bạn không hỗ trợ fullscreen.');
  }
}

export function leafletZoomToCesiumHeight(leafletZoom: number) {
  // Chiều rộng của bản đồ tại mức zoom 0 trong Leaflet
  const leafletZoom0Width = 256;

  // Bán kính lớn của elipsoide trong Cesium
  const cesiumSemiMajorAxis = 6378137;

  // Tính tỷ lệ giữa chiều rộng của bản đồ trong Leaflet và Cesium
  const ratio = cesiumSemiMajorAxis / (2 * Math.PI * leafletZoom0Width);

  // Tính độ cao tương ứng trong Cesium
  return leafletZoom * ratio;
}

export const flyToBoundingSphere = (boundingSphere: BoundingSphere) => {
  const viewerStore = useViewerStore();
  viewerStore?.viewer?.camera.flyToBoundingSphere(boundingSphere, {
    duration: 2,
  });
};
