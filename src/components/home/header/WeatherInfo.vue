<template>
  <div
    class="flex flex-row items-center space-x-4 overflow-hidden cursor-e-resize mr-4"
    ref="scrollContainer"
  >
    <div class="flex flex-row items-center">
      <img
        :src="weatherInfo.icon_url"
        width="32"
        height="30"
        alt="icon-weather"
        v-if="isSuccess"
      />
      <a-typography-text class="text-white font-normal ml-2.5 whitespace-nowrap">
        {{ weatherInfo.temperate }}
      </a-typography-text>
      <a-button
        type="ghost"
        @click="isExpanded = !isExpanded"
        class="m-0 p-0 -mr-4"
      >
        <template #icon>
          <IconExpandWeather :class="!isExpanded && 'rotate-180'" />
        </template>
      </a-button>
    </div>
    <div class="overflow-hidden flex">
      <Transition name="expanded">
        <div
          class="flex flex-row items-center space-x-4"
          v-if="isExpanded"
        >
          <!--        <div class="flex flex-row items-center">
            <IconUV />
            <a-typography-text class="text-white font-normal ml-2.5 whitespace-nowrap">
              UV 8
            </a-typography-text>
          </div>-->
          <!--        <IconLine />-->
          <div class="flex flex-row items-center">
            <IconWindy />
            <a-typography-text class="text-white font-normal ml-2.5 whitespace-nowrap">
              {{ weatherInfo.windSpeed }}
            </a-typography-text>
          </div>
          <IconLine />
          <div class="flex flex-row items-center">
            <IconHumidity />
            <a-typography-text class="text-white font-normal ml-2.5 whitespace-nowrap">
              {{ weatherInfo?.humidity }}
            </a-typography-text>
          </div>
          <!--        <IconLine />-->
          <!--        <a-typography-text class="text-white font-normal whitespace-nowrap">
            PM 1.0.0
          </a-typography-text>
          <IconLine />
          <div>
            <a-typography-text class="text-white font-bold whitespace-nowrap">
              {{ 'AOI ' }}
            </a-typography-text>
            <a-typography-text class="text-white font-normal whitespace-nowrap">
              120
            </a-typography-text>
          </div>-->
        </div>
      </Transition>
      <Transition name="collapse">
        <div
          class="flex flex-row items-center space-x-4"
          v-if="!isExpanded"
        >
          <a-typography-text
            class="text-white font-normal whitespace-nowrap"
            id="oclock_time"
          >
            {{ formattedTime }}
          </a-typography-text>
          <IconLine />
          <a-typography-text
            id="oclock_date"
            class="text-white font-normal whitespace-nowrap"
          >
            {{ date }}
          </a-typography-text>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconWindy from '@/components/icons/home/IconWindy.vue';
import IconHumidity from '@/components/icons/home/IconHumidity.vue';
import IconExpandWeather from '@/components/icons/home/IconExpandWeather.vue';
import IconLine from '@/components/icons/IconLine.vue';
import { computed, onMounted, ref } from 'vue';
import { addUnit, convertF2C, useWeather } from '@/DTP/weather';
import { useTimer } from '@/DTP/time/clock';
import { defaultMapConfig, OPEN_WEATHER_ICON_URL } from '@/DTP/config';

const isExpanded = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  scrollContainer?.value?.addEventListener('wheel', (event) => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft += event.deltaY;
    }
    event.preventDefault();
  });
});

const lat = ref<number>(defaultMapConfig.centerPoint.lat);
const lng = ref<number>(defaultMapConfig.centerPoint.lng);

const { data, isSuccess } = useWeather(lat, lng);

const weatherInfo = computed(() => {
  const dataMain = data.value?.data?.main;
  return {
    temperate: dataMain?.temp ? addUnit(convertF2C(dataMain?.temp), '°C') : '', // Nhiệt độ
    humidity: dataMain?.humidity ? addUnit(dataMain?.humidity, '%') : '', // Độ ẩm
    pressure: dataMain?.pressure ? addUnit(dataMain?.pressure, 'PA') : '', // Áp lực khí quyển
    windSpeed: data?.value?.data?.wind?.speed
      ? addUnit(data?.value?.data?.wind?.speed, ' m/s')
      : '', // tốc độ gió
    icon_url: OPEN_WEATHER_ICON_URL + data?.value?.data?.weather[0]?.icon + '.png',
  };
});

const { formattedTime, date } = useTimer();
</script>
