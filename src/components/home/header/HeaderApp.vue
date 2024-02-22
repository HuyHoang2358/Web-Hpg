<template>
  <header
    class="absolute z-50 bg-[#151515] bg-opacity-90 flex flex-col w-full header-container justify-center"
  >
    <a-row class="px-4 items-center">
      <a-col :span="7">
        <WeatherInfo />
      </a-col>
      <a-col :span="10">
        <div class="h-11 flex flex-col justify-center">
          <h1
            class="text-[#D0002D] m-0 font-bold text-base lg:text-xl whitespace-nowrap font-magistral text-center"
          >
            {{ $t('home.title') }}
          </h1>
        </div>
      </a-col>
      <a-col :span="7">
        <ProfileInfo />
      </a-col>
    </a-row>
  </header>
</template>

<script setup lang="ts">
import WeatherInfo from '@/components/home/header/WeatherInfo.vue';
import ProfileInfo from '@/components/home/header/ProfileInfo.vue';
</script>

<style scoped>
.header-container {
  height: 54px;
}
</style>
