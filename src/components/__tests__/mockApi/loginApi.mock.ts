import type { LoginResType } from '@/services/apis/config';

export const mockLoginApiSuccess: LoginResType = {
  accessToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3MDYyNzc1MTMsInNjb3BlIjpbIkFETUlOLkVESVQiLCJBRE1JTi5WSUVXIiwiVVNFUlMuVklFVyIsIlVTRVJTLkVESVQiLCJTWVNURU0uU0VORE1BSUwiLCJTWVNURU0uVklFVyIsIlNZU1RFTS5FRElUIl0sInJvbGUiOlsiU1lTVEVNLkFETUlOIl0sInVzZXJfbmFtZSI6ImFkbWluIiwianRpIjoiNmMwOTU3NDItYjE5OS00MmFiLWI5YzEtOGE5MmNlOTYwMjBiIn0.mqmtx-Q2cNtdd-aTWv9cvHBg-Wqxq7A-iBl2hubIyt4fc76XgBg8-I1ahdyjGIcl-tswW5vqTKGF-O7_0PJLtUrmjxs9oEgGsCfEEFHDCFkZiB0sR6dYSnB_2MUPFGiAQX4LZNhSw5Z52AX-WiXD68z1H6la8h_FdfFGWLRksvlFBRj7qssObpDfOPMpb40iCZ1roQadO7PTIiraoepCF9rhc1njkqYiMO5SIH6Rd00f1_Ezi_ldVhmgpIC12DJ4yHfE4yW1d-wguWqQzdOqhMMEc4W3OgYKo6wLp-EfiIqQBv8vx5Tt-MLeCTA2CKDljz7jW2p8Xh9yCReVYH21Zg',
  timeExpiration: 300000000,
  refreshToken: 'b0e8c3f2-27de-41c5-b78f-8ca4bd4da372',
  refreshTimeExpiration: 86400000,
  userName: 'admin',
  scopes: [
    'ADMIN.EDIT',
    'ADMIN.VIEW',
    'USERS.VIEW',
    'USERS.EDIT',
    'SYSTEM.SENDMAIL',
    'SYSTEM.VIEW',
    'SYSTEM.EDIT',
  ],
  roles: ['SYSTEM.ADMIN'],
  menus: null,
};

export const mockLoginApiError = {
  timestamp: '23-01-2024 09:42:33',
  service: 'system-api',
  requestId: '842baab3-9637-4481-a422-fb0e8d9f23f4',
  code: 107,
  msg: 'Người dùng không tồn tại',
  data: null,
  encrypt: false,
};
