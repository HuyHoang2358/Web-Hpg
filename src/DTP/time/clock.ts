import { onBeforeUnmount, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { displayDateFormat } from '@/utils/constants';

function formatTimeNumber(num: number) {
  return String(num).padStart(2, '0');
}
function getTime() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${formatTimeNumber(hour)}:${formatTimeNumber(minutes)}:${formatTimeNumber(seconds)}`;
}

export const useTimer = () => {
  let timer: ReturnType<typeof setInterval>;

  const formattedTime = ref(getTime());
  const startTimer = () => {
    timer = setInterval(() => {
      formattedTime.value = getTime();
    }, 1000);
  };

  onMounted(() => {
    startTimer();
  });

  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return {
    formattedTime,
    date: dayjs().format(displayDateFormat),
  };
};
