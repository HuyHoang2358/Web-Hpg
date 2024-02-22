import { OPEN_WEATHER_KEY, OPEN_WEATHER_API } from '@/DTP/config';
import axios from 'axios';
import { useQuery } from '@tanstack/vue-query';
import type { ComputedRef, Ref } from 'vue';

export function convertF2C(f: any) {
  return f && (f - 273.15).toFixed();
}

export function addUnit(num: number | string, unit: string) {
  return `${num}${unit}`;
}

export interface WeatherResType {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

const WEATHER_QUERY_KEY = 'WEATHER_QUERY_KEY';

const getWeather = (lat?: number, lon?: number): Promise<{ data: WeatherResType }> =>
  axios.get(`${OPEN_WEATHER_API}lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`);

export const useWeather = (lat: Ref<number | undefined>, lng: Ref<number | undefined>) => {
  return useQuery({
    queryKey: [WEATHER_QUERY_KEY, lat.value, lng.value],
    queryFn: () => getWeather(lat.value, lng.value),
  });
};
