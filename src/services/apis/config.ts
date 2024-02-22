import type { WrapperResponse } from '@/services/commonTypes';
import clientSystemApi from '@/services/clientSystemApi';
import { API_GENERATE_TOKEN } from '@/utils/apiPath';

export type Credentials = {
  identity?: string;
  password?: string;
};

export interface LoginResType {
  accessToken: string;
  timeExpiration: number;
  refreshToken: string;
  refreshTimeExpiration: number;
  userName: string;
  scopes: string[];
  roles: string[];
  menus: any;
}

export const login = (credentials: Credentials): WrapperResponse<LoginResType> => {
  const au = btoa(credentials.identity + ':' + credentials.password);
  return clientSystemApi.get(API_GENERATE_TOKEN, {
    headers: {
      Authorization: 'Basic ' + au,
    },
    params: {
      appId: 'SYSTEM',
      grantType: 'PASSWORD_GRANT',
      secret: import.meta.env.VITE_SECRET,
    },
  });
};
