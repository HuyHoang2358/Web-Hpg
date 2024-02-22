import axios from 'axios';
import { useConfigStore } from '@/stores/config';

const clientGeoApi = axios.create({
  timeout: 15000,
  baseURL: import.meta.env.VITE_GEO_API,
});

clientGeoApi.interceptors.request.use(
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

clientGeoApi.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response?.data;
    } else {
      console.warn('status # 200');
    }
  },
  async function (error) {
    // if (error.response && error.response.status === 401) {
    //   // Thực hiện các hành động như đăng nhập lại hoặc hiển thị thông báo
    //
    //   await router.replace({
    //     path: LOGIN_PAGE_PATH,
    //     replace: true,
    //   });
    // }
    throw error;
  },
);

export default clientGeoApi;
