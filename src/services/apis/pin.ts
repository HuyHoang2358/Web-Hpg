import clientGeoApi from '@/services/clientGeoApi';
import { GEO_API_GET_PINS_BY_PROVINCE } from '@/utils/apiPath';

import type { PinType, WrapperResponse } from '@/services/commonTypes';

export const fetchPinsByProvince = (): WrapperResponse<PinType[]> =>
  clientGeoApi.get(`${GEO_API_GET_PINS_BY_PROVINCE}`);
