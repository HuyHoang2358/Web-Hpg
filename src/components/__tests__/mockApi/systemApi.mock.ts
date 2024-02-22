import type {
  AdministrativeResType,
  PositionResType,
  ProfileResType,
  RoleResType,
  UnitResType,
  UserResType,
} from '@/services/apis/systemApi';
import type { WrapperDataResponse } from '@/components/__tests__/common';

export const mockApiProfileSuccess: ProfileResType = {
  createdDate: '2023-05-02 21:38:30',
  updatedDate: '2023-12-18 16:56:04',
  createdBy: 'admin',
  updatedBy: 'admin',
  userId: 'admin',
  name: 'admin',
  password: '$2a$10$Pb7R2s.71AAj2xpnbrXqUOI5vJGYbUAk.vQDJbJocEB.nneXqo6aS',
  email: 'admin1@gmail.com',
  phone: '0932930423',
  positionId: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
  unitId: '2f418957-4c99-4068-ad3b-4670ababad31',
  administrativeAddressId: '95038a90-a60c-44c4-afb0-a8639908ea9d',
  address: 'mock-address',
  notificationOn: false,
};

export const mockApiGetRolesSuccess: WrapperDataResponse<RoleResType[]> = {
  data: [
    {
      roleId: 'ADMIN',
      roleName: 'ADMIN',
      appId: 'SYSTEM',
    },
    {
      roleId: 'USER',
      roleName: 'User',
      appId: 'SYSTEM',
    },
    {
      roleId: 'SYSTEM.ADMIN',
      roleName: 'SYSTEM.ADMIN',
      appId: 'SYSTEM',
    },
  ],
};

export const mockApiGetUsersSuccess: WrapperDataResponse<UserResType> = {
  data: {
    page: 0,
    pageSize: 10,
    total: 23,
    totalPage: 3,
    items: [
      {
        userId: 'aaaaaaaaaaaaaaaaaaaaa',
        name: 'User 1',
        email: 'ad.a@gmail.com',
        address: 'Quận Hồng Bàng - Phường Minh Khai',
        site: null,
        phone: '0975029650',
        positionId: 'd152b3b8-9ac2-4556-a83d-c1f308c861c9',
        positionName: 'Test 3',
        unitId: 'ec9edb95-002e-49fc-830f-27cc75867b60',
        unitName: 'Sở Nông nghiệp và Phát triển nông thôn',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '19cb3dbe-8b12-43fd-97b7-aa2c7812a958',
      },
      {
        userId: 'admin',
        name: 'User 2',
        email: 'admin1@gmail.com',
        address: 'Quận Hồng Bàng - Phường Quán Toan',
        site: null,
        phone: '0932930423',
        positionId: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
        positionName: 'Giám đốc',
        unitId: '2f418957-4c99-4068-ad3b-4670ababad31',
        unitName: 'Sở Xây dựng',
        roleUnitsList: [
          {
            roleId: 'SYSTEM.ADMIN',
            roleName: 'SYSTEM.ADMIN',
            unitIdList: [],
          },
        ],
        commune: null,
        province: null,
        addressId: '95038a90-a60c-44c4-afb0-a8639908ea9d',
      },
      {
        userId: 'asdfsdfsdf',
        name: 'User 3',
        email: 'sdafas@gmail.com',
        address: 'Quận Hồng Bàng - Phường Quán Toan',
        site: null,
        phone: '0868695382',
        positionId: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
        positionName: 'Giám đốc',
        unitId: 'a8562cb7-88dd-4013-bcad-9dcb60bc59ba',
        unitName: 'Sở Tài nguyên môi trường',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '95038a90-a60c-44c4-afb0-a8639908ea9d',
      },
      {
        userId: 'sfds',
        name: 'User 4',
        email: 'test3@gmail.com',
        address: 'Quận Hồng Bàng - Phường Hùng Vương',
        site: null,
        phone: '0392042342',
        positionId: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
        positionName: 'Giám đốc',
        unitId: '',
        unitName: null,
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: 'd4dd389e-1e5c-4459-bb3e-d90ec69affe5',
      },
      {
        userId: 'afdsaf',
        name: 'User 5',
        email: 'fdsa@gmail.com',
        address: 'Quận Hồng Bàng - Phường Hùng Vương',
        site: null,
        phone: '0392042342',
        positionId: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
        positionName: 'Giám đốc',
        unitId: '',
        unitName: null,
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: 'd4dd389e-1e5c-4459-bb3e-d90ec69affe5',
      },
      {
        userId: 'fdsafdsa231 ',
        name: 'User 6',
        email: 'test3@gmail.com',
        address: 'Quận Ngô Quyền',
        site: null,
        phone: '0392042342',
        positionId: 'd1c51c39-8c2a-453c-bdc2-ed576ba62b77',
        positionName: 'Test 1',
        unitId: 'd5e349d4-25de-4296-ad83-947edf5f4c5c',
        unitName: 'Phòng Tài nguyên môi trường huyện',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '97b1eef5-fae7-4564-bcf0-8faf203012b0',
      },
      {
        userId: 'fdsa13421',
        name: 'User 7',
        email: 'fdsaf@gmail.com',
        address: 'Quận Hồng Bàng - Phường Quán Toan',
        site: null,
        phone: '0392042342',
        positionId: 'd152b3b8-9ac2-4556-a83d-c1f308c861c9',
        positionName: 'Test 3',
        unitId: 'ec9edb95-002e-49fc-830f-27cc75867b60',
        unitName: 'Sở Nông nghiệp và Phát triển nông thôn',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '95038a90-a60c-44c4-afb0-a8639908ea9d',
      },
      {
        userId: 'fdsaf',
        name: 'User 8',
        email: 'fdsa@gmail.com',
        address: 'Quận Hồng Bàng - Phường Hùng Vương',
        site: null,
        phone: '0392042342',
        positionId: '68f51839-59e5-4589-924a-14f039fcd3d0',
        positionName: 'Phó Giám đốc',
        unitId: '',
        unitName: null,
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: 'd4dd389e-1e5c-4459-bb3e-d90ec69affe5',
      },
      {
        userId: 'fdsa',
        name: 'User 9',
        email: 'fdsa@gmail.com',
        address: 'Quận Hồng Bàng - Phường Quán Toan',
        site: null,
        phone: '0392042342',
        positionId: '68f51839-59e5-4589-924a-14f039fcd3d0',
        positionName: 'Phó Giám đốc',
        unitId: 'aad328de-3bd6-4436-b3f6-95bd8f720d59',
        unitName: 'Sở Thông tin truyền thông',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '95038a90-a60c-44c4-afb0-a8639908ea9d',
      },
      {
        userId: 'fdsaf fsdafdsa',
        name: 'User 10',
        email: 'test3@gmail.com',
        address: null,
        site: null,
        phone: '0392042342',
        positionId: '68f51839-59e5-4589-924a-14f039fcd3d0',
        positionName: 'Phó Giám đốc',
        unitId: 'c65ca387-3ff3-47c6-8838-f41cfe231679',
        unitName: 'Sở Giao thông vận tải',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: null,
      },
    ],
  },
};

export const mockApiSearchUsersSuccess: WrapperDataResponse<UserResType> = {
  data: {
    page: 0,
    pageSize: 10,
    total: 1,
    totalPage: 1,
    items: [
      {
        userId: 'aaaaaaaaaaaaaaaaaaaaa',
        name: 'User 1',
        email: 'ad.a@gmail.com',
        address: 'Quận Hồng Bàng - Phường Minh Khai',
        site: null,
        phone: '0975029650',
        positionId: 'd152b3b8-9ac2-4556-a83d-c1f308c861c9',
        positionName: 'Test 3',
        unitId: 'ec9edb95-002e-49fc-830f-27cc75867b60',
        unitName: 'Sở Nông nghiệp và Phát triển nông thôn',
        roleUnitsList: [],
        commune: null,
        province: null,
        addressId: '19cb3dbe-8b12-43fd-97b7-aa2c7812a958',
      },
    ],
  },
};

export const mockApiGetAdministrativeSuccess: WrapperDataResponse<AdministrativeResType[]> = {
  data: [
    {
      id: 'b0c06be4-2a2c-49e8-a6ca-930a3ab93b10',
      name: 'Quận Hồng Bàng',
      code: '303',
      level: 'Quận/Huyện',
      description: null,
      isActive: true,
      parentId: null,
    },
    {
      id: '95038a90-a60c-44c4-afb0-a8639908ea9d',
      name: 'Phường Quán Toan',
      code: '11296',
      level: 'Phường',
      description: null,
      isActive: true,
      parentId: 'b0c06be4-2a2c-49e8-a6ca-930a3ab93b10',
    },
  ],
};

export const mockApiGetUnitsSuccess: WrapperDataResponse<UnitResType[]> = {
  data: [
    {
      id: 'aad328de-3bd6-4436-b3f6-95bd8f720d59',
      unitName: 'Sở Thông tin truyền thông',
      appId: null,
      parentId: null,
      unitCode: null,
    },
    {
      id: 'a8562cb7-88dd-4013-bcad-9dcb60bc59ba',
      unitName: 'Sở Tài nguyên môi trường',
      appId: null,
      parentId: 'e06e43be-350f-4e08-948c-99bae1b1a41e',
      unitCode: null,
    },
    {
      id: 'ec9edb95-002e-49fc-830f-27cc75867b60',
      unitName: 'Sở Nông nghiệp và Phát triển nông thôn',
      appId: 'SYSTEM',
      parentId: null,
      unitCode: 'snnptnt',
    },
    {
      id: 'c65ca387-3ff3-47c6-8838-f41cfe231679',
      unitName: 'Sở Giao thông vận tải',
      appId: 'SYSTEM',
      parentId: null,
      unitCode: 'sgtvt_hpg',
    },
    {
      id: 'caa4a291-426b-44a9-b818-9220b5bc1d09',
      unitName: 'Sở Kế hoạch đầu tư',
      appId: null,
      parentId: null,
      unitCode: null,
    },
    {
      id: '2f418957-4c99-4068-ad3b-4670ababad31',
      unitName: 'Sở Xây dựng',
      appId: null,
      parentId: null,
      unitCode: null,
    },
    {
      id: '08661c2f-8964-4e83-96d5-13dc661bcbf9',
      unitName: 'Đơn vị cấp 3',
      appId: null,
      parentId: 'a3fbdf6d-83d3-48b8-b51f-1dff4b7bee2a',
      unitCode: null,
    },
    {
      id: '7576d27d-233e-4071-bdbb-3bf4f5864662',
      unitName: 'fdsa',
      appId: null,
      parentId: 'b18d2214-2b63-4580-b489-a01a12d38e12',
      unitCode: 'fdsf',
    },
    {
      id: 'd966ba2b-2665-416b-8f78-cf36551277d0',
      unitName: 'Đơn vị cấp 5',
      appId: null,
      parentId: 'd97de1de-ac54-47e3-a023-d6dcacdb2159',
      unitCode: null,
    },
    {
      id: 'd5e349d4-25de-4296-ad83-947edf5f4c5c',
      unitName: 'Phòng Tài nguyên môi trường huyện',
      appId: null,
      parentId: 'a8562cb7-88dd-4013-bcad-9dcb60bc59ba',
      unitCode: 'ptnmth',
    },
    {
      id: 'e06e43be-350f-4e08-948c-99bae1b1a41e',
      unitName: 'Phòng Xây dựng huyện',
      appId: null,
      parentId: '2f418957-4c99-4068-ad3b-4670ababad31',
      unitCode: 'pxdh',
    },
    {
      id: '1311d831-18de-4208-b748-fe3b4e24449f',
      unitName: 'Phòng Kế hoạch đầu tư huyện',
      appId: null,
      parentId: 'caa4a291-426b-44a9-b818-9220b5bc1d09',
      unitCode: 'pkhdth',
    },
    {
      id: '005a16f0-474a-4762-b891-0c90059e4c2e',
      unitName: 'Phòng Tài chính 2',
      appId: null,
      parentId: 'aad328de-3bd6-4436-b3f6-95bd8f720d59',
      unitCode: null,
    },
    {
      id: '403b3d91-c690-4581-84e7-8260e41a0b41',
      unitName: 'Phòng giao thông 1',
      appId: null,
      parentId: '005a16f0-474a-4762-b891-0c90059e4c2e',
      unitCode: 'qewqweq',
    },
  ],
};

export const mockApiGetPositionSuccess: WrapperDataResponse<PositionResType[]> = {
  data: [
    {
      id: '9f05d9a8-7a6b-4a7e-95ea-a2bbd2a2e59a',
      createdDate: '2023-12-07 09:35:08',
      updatedDate: '2023-12-07 09:35:08',
      createdBy: 'admin',
      updatedBy: 'admin',
      name: 'Giám đốc',
      code: '2',
      description: 'giám đốc',
    },
    {
      id: '68f51839-59e5-4589-924a-14f039fcd3d0',
      createdDate: '2023-11-10 10:20:41',
      updatedDate: '2023-12-08 10:08:37',
      createdBy: 'admin',
      updatedBy: 'admin',
      name: 'Phó Giám đốc',
      code: '112',
      description: 'string',
    },
    {
      id: 'd1c51c39-8c2a-453c-bdc2-ed576ba62b77',
      createdDate: '2023-12-07 09:35:24',
      updatedDate: '2023-12-07 17:00:30',
      createdBy: 'admin',
      updatedBy: 'admin',
      name: 'Test 1',
      code: '111',
      description: 'test',
    },
    {
      id: 'd152b3b8-9ac2-4556-a83d-c1f308c861c9',
      createdDate: '2023-12-07 19:23:07',
      updatedDate: '2023-12-18 14:33:36',
      createdBy: 'admin',
      updatedBy: 'admin',
      name: 'Test 3',
      code: '115',
      description: 'test1',
    },
  ],
};

export const mockApiDownloadUserListSuccess = 'Hello, this is a Blob example!';

export const mockApiMutationSuccess = {
  timestamp: '24-01-2024 09:12:35',
  service: 'system-api',
  requestId: '98050a7b-df1c-4882-b1f2-b6a7dc88f30a',
  code: 0,
  msg: 'Successful!',
  data: 'OK',
  encrypt: false,
};

export const mockApiMutationFailed = {
  timestamp: '24-01-2024 09:12:35',
  service: 'system-api',
  requestId: '98050a7b-df1c-4882-b1f2-b6a7dc88f30a',
  code: 0,
  msg: 'Fail!',
  data: 'OK',
  encrypt: false,
};
