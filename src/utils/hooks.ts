import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useMapToolStore } from '@/stores/mapTool';

const useWindowResize = () => {
  const headerHeight = ref(54);
  const bottomHeight = ref(195);
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);

  const remainHeight = computed(() => windowHeight.value - headerHeight.value - bottomHeight.value);

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });

  const mapToolStore = useMapToolStore();

  watch(
    () => mapToolStore.isShowBottom,
    () => {
      bottomHeight.value = mapToolStore.isShowBottom ? 195 : 48;
    },
  );

  return { windowWidth, windowHeight, remainHeight };
};

export default useWindowResize;
