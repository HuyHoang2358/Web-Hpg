import axios from 'axios';
import router from '@/router';
import { LOGIN_PAGE_PATH } from '@/utils/routePath';
import { useConfigStore } from '@/stores/config';

const clientSystemApi = axios.create({
  timeout: 15000,
  baseURL: import.meta.env.VITE_SYSTEM_API,
});

clientSystemApi.interceptors.request.use(
  async (config) => {
    const configStore = useConfigStore();

    // @ts-ignore
    config.headers = {
      Authorization: configStore.accessToken ? `Bearer ${configStore.accessToken}` : undefined,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

clientSystemApi.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response?.data;
    } else {
      console.warn('status # 200');
    }
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      await router.replace({
        path: LOGIN_PAGE_PATH,
        replace: true,
      });
    }
    throw error;
  },
);

export default clientSystemApi;
