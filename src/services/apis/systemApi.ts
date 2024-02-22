import {
  API_ADD_MENU_TO_ROLE,
  API_ADD_NEW_MENU,
  API_ADD_NEW_ROLE,
  API_ADD_RIGHT_TO_ROLE,
  API_ADD_ROLE_TO_USER,
  API_ADMINISTRATIVE_FROM_EXCEL,
  API_CHANGE_PASSWORD,
  API_CHANGE_PASSWORD_BY_ADMIN,
  API_CREATE_DATA_TYPE,
  API_CREATE_FIELD,
  API_CREATE_POSITION,
  API_CREATE_RIGHT,
  API_CREATE_USER,
  API_DELETE_ADMINISTRATIVE,
  API_DELETE_DATA_TYPE,
  API_DELETE_FIELD,
  API_DELETE_MENU,
  API_DELETE_POSITION,
  API_DELETE_RIGHT,
  API_DELETE_ROLE,
  API_DELETE_USER,
  API_DOWNLOAD_USER_LIST,
  API_EDIT_POSITION,
  API_EDIT_ROLE,
  API_EDIT_USER,
  API_GET_LOGS,
  API_GET_MENUS,
  API_GET_NOTIFICATIONS,
  API_GET_PROFILE,
  API_GET_ROLE,
  API_GET_ROLES,
  API_GET_USERS,
  API_GET_USERS_UNITS,
  API_INSERT_FROM_EXCEL,
  API_UNITS_FROM_EXCEL,
  API_UPDATE_DATA_TYPE,
  API_UPDATE_FIELD,
  API_UPDATE_NEW_MENU,
  API_UPDATE_RIGHT,
  API_UPDATE_SETTING,
  SYS_API_ADD_UNIT,
  SYS_API_CREATE_ADMINISTRATIVE,
  SYS_API_DELETE_UNIT,
  SYS_API_DELETE_USER_IN_UNIT,
  SYS_API_GET_ADMINISTRATIVE,
  SYS_API_GET_APPS,
  SYS_API_GET_DATA_TYPE,
  SYS_API_GET_FIELDS,
  SYS_API_GET_POSITIONS,
  SYS_API_GET_RIGHTS,
  SYS_API_GET_UNITS,
  SYS_API_UPDATE_ADMINISTRATIVE,
  SYS_API_UPDATE_UNIT,
} from '@/utils/apiPath';
import clientSystemApi from '@/services/clientSystemApi';
import type { WrapperResponse } from '@/services/commonTypes';
import type { Key } from 'ant-design-vue/es/_util/type';
import type { Ref } from 'vue';

export type AppResType = {
  appId: string;
  appName: string;
};

export type MenuResType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  description: string;
  icon: string;
  url?: string;
  parentId?: string | null;
  sortOrder: number;
  appId: string;
};

export type ProfileResType = {
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  userId: string;
  name: string;
  password: string;
  email: string;
  address: string;
  phone: string;
  positionId: string;
  administrativeAddressId: string;
  unitId: string;
  notificationOn: boolean;
  units: UnitResType[];
};

export type RightResType = {
  rightId: string;
  rightName: string;
  sortOrder: number;
  updatedBy: string;
};

export type FieldResType = {
  id: string;
  name: string;
  description: string;
};

export type DataResType = {
  id: string;
  name: string;
  description: string;
};

export type AdministrativeResType = {
  id: string;
  name: string;
  level: string;
  description: string | null;
  code: string;
  isActive: boolean;
  parentId: string | null;
};

export type UnitResType = {
  id: string;
  parentId?: string | null; // null
  parentUnitId?: string | null; // null
  unitCode: string | null; // Mã
  appId: string | null; // Mã
  unitName: string;
};

export interface PositionResType {
  id: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  code: string;
  description: string;
}

export type CreateMenuBody = {
  description: string;
  name: string;
  parentId: string | null;
};

export type CreateAdministrativeBody = {
  name: string;
  parentId: string | null;
};

export type CreateRoleBody = {
  appId: string;
  roleId: string;
  roleName: string;
  parentId: string | null;
  menuInRole: [];
  rightInRole: [];
  userInRole: [];
};

export type CreateRightBody = {
  rightId: string;
  rightName: string;
};

export type CreateFieldBody = {
  description: string;
  name: string;
};

export type CreateDataTypeBody = {
  name: string;
  description: string;
};

export type CreatePositionBody = {
  code: string;
  description: string;
  name: string;
};

export type UserRequestParams = {
  page?: string | number;
  units?: string;
  address?: string;
  roles?: string;
  positions?: string;
  size?: string | number;
  searchValue?: string;
  sort?: string;
  direction?: string;
};

export type LogRequestParams = {
  userIds?: string;
  searchValue?: string;
  sort?: string;
  direction?: string;
};

export type PositionRequestParams = {
  searchValue?: string;
};

export type RoleResType = {
  roleId: string;
  roleName: string;
  appId: string;
};

export type NotificationResType = {
  id: string;
  userId: string;
  description: string;
  isSeen: boolean;
  title: string;
};

export type LogResType = {
  id: string;
  userId: string;
  name?: string;
  createdDate: string;
  description: string;
};

export interface UserResType {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: User[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
  address: string | null;
  positionId: string;
  unitId: string;
  unitName: string | null;
  addressId: string | null;
  positionName: string;
  site: string | null;
  commune: string | null;
  province: string | null;
  phone: string;
  roleUnitsList: {
    roleId: string;
    unitIdList: string[];
    roleName: string;
  }[];
}

export type CreateUserBody = {
  userId: string;
  email?: string;
  phone?: string;
  administrativeAddressId?: string;
};

export type UpdateUserBody = {
  userId: string;
  positionId?: string;
  unitId?: string;
  email?: string;
  phone?: string;
  name?: string;
};

export type SettingBody = {
  notificationOn?: boolean;
};

export type AddRoleToUserBody = {
  addUserRoleUnitDtoList: {
    roleId: Key;
    unitIdList: string[];
  }[];
  userId: string;
};

export type AddRightToRoleBody = {
  rightInRole: string[];
  roleIdList: string[];
};

export type AddMenuToRoleBody = {
  menuInRole: string[];
  roleIdList: string[];
};

export type ChangePasswordBody = {
  newPassword: string;
  oldPassword: string;
};

export type ChangePasswordByAdminBody = {
  newPassword: string;
  userId: string;
};

export type BaseParams = {
  searchValue?: string;
  sort?: string;
  direction?: string;
  page?: string;
  size?: string;
};

export type BaseRefParams = {
  searchValue?: Ref<string>;
  direction?: Ref<string>;
  sort?: Ref<string>;
  currentPage?: Ref<number>;
  pageSize?: Ref<number>;
};

export const fetchApps = (): WrapperResponse<AppResType[]> => clientSystemApi.get(SYS_API_GET_APPS);
export const fetchRights = (): WrapperResponse<RightResType[]> =>
  clientSystemApi.get(SYS_API_GET_RIGHTS);
export const fetchFields = (params: BaseParams): WrapperResponse<FieldResType[]> =>
  clientSystemApi.get(SYS_API_GET_FIELDS, {
    params,
  });

export const fetchDataTypes = (params: BaseParams): WrapperResponse<DataResType[]> =>
  clientSystemApi.get(SYS_API_GET_DATA_TYPE, {
    params,
  });

export const fetchAdministrative = (params: BaseParams): WrapperResponse<AdministrativeResType[]> =>
  clientSystemApi.get(SYS_API_GET_ADMINISTRATIVE, {
    params,
  });

export const fetchUnits = (): WrapperResponse<UnitResType[]> =>
  clientSystemApi.get(SYS_API_GET_UNITS);

export const fetchUsersInUnit = (
  params: { unitIds: string; positions?: string } & BaseParams,
): WrapperResponse<UserResType> =>
  clientSystemApi.get(API_GET_USERS_UNITS, {
    params,
  });

export const fetchPositions = (params: PositionRequestParams): WrapperResponse<PositionResType[]> =>
  clientSystemApi.get(SYS_API_GET_POSITIONS, { params: params });

export const createUnit = (data: UnitResType): WrapperResponse<UnitResType> =>
  clientSystemApi.post(SYS_API_ADD_UNIT, data);
export const createAdministrative = (data: CreateAdministrativeBody) =>
  clientSystemApi.post(SYS_API_CREATE_ADMINISTRATIVE, data);
export const editUnit = (data: UnitResType) => clientSystemApi.post(SYS_API_UPDATE_UNIT, data);
export const editAdministrative = (
  data: Partial<CreateAdministrativeBody> & { id: string; isActive?: boolean },
) => clientSystemApi.put(SYS_API_UPDATE_ADMINISTRATIVE, data);
export const deleteUnit = (idUnit: string) =>
  clientSystemApi.delete(SYS_API_DELETE_UNIT, { params: { id: idUnit } });
export const deleteUserUnit = (userId: string) =>
  clientSystemApi.put(
    SYS_API_DELETE_USER_IN_UNIT,
    {},
    {
      params: { userId },
    },
  );

export const fetchMenus = (): WrapperResponse<MenuResType[]> => clientSystemApi.get(API_GET_MENUS);

export const createMenu = (data: CreateMenuBody) => clientSystemApi.post(API_ADD_NEW_MENU, data);
export const editMenu = (data: CreateMenuBody & { id: string }) =>
  clientSystemApi.post(API_UPDATE_NEW_MENU, data);

export const editRole = (data: CreateRoleBody) => clientSystemApi.post(API_EDIT_ROLE, data);
export const updateRight = (data: CreateRightBody & { id: string }) =>
  clientSystemApi.put(API_UPDATE_RIGHT, data);

export const updateField = (data: CreateFieldBody & { id: string }) =>
  clientSystemApi.post(API_UPDATE_FIELD, data);

export const updateDataType = (data: CreateDataTypeBody & { id: string }) =>
  clientSystemApi.post(API_UPDATE_DATA_TYPE, data);
export const editPosition = (data: CreatePositionBody & { id: string }) =>
  clientSystemApi.post(API_EDIT_POSITION, data);

export const deleteMenu = (ids: string[]) =>
  clientSystemApi.post(API_DELETE_MENU, { menuList: ids });

export const deleteRole = (ids: string[]) =>
  clientSystemApi.post(API_DELETE_ROLE, { roleList: ids });
export const deleteRight = (id: string) =>
  clientSystemApi.delete(API_DELETE_RIGHT, { params: { rightId: id } });

export const deleteField = (id: string) =>
  clientSystemApi.delete(API_DELETE_FIELD, { params: { id } });
export const deleteDataType = (id: string) =>
  clientSystemApi.delete(API_DELETE_DATA_TYPE, { params: { id } });
export const deleteAdministrative = (id: string) =>
  clientSystemApi.delete(API_DELETE_ADMINISTRATIVE, { params: { id } });

export const deletePosition = (id: string) =>
  clientSystemApi.delete(API_DELETE_POSITION, { params: { id } });

export const deleteUser = (ids: string) => clientSystemApi.post(API_DELETE_USER, { userId: ids });
export const changePasswordByAdmin = (data: ChangePasswordByAdminBody) =>
  clientSystemApi.post(API_CHANGE_PASSWORD_BY_ADMIN, data);

export const downloadUserList = (): Promise<Blob> =>
  clientSystemApi.get(API_DOWNLOAD_USER_LIST, {
    responseType: 'blob',
  });

export const fetchRoles = (): WrapperResponse<RoleResType[]> => clientSystemApi.get(API_GET_ROLES);
export const fetchNotifications = (): WrapperResponse<NotificationResType[]> =>
  clientSystemApi.get(API_GET_NOTIFICATIONS);
export const fetchLogs = (params: LogRequestParams): WrapperResponse<LogResType[]> =>
  clientSystemApi.get(API_GET_LOGS, {
    params,
  });

export const fetchUsers = (params: UserRequestParams): WrapperResponse<UserResType> =>
  clientSystemApi.get(API_GET_USERS, {
    params,
  });

export const createUser = (data: CreateUserBody) => clientSystemApi.post(API_CREATE_USER, data);

export const updateUser = (data: UpdateUserBody) => clientSystemApi.post(API_EDIT_USER, data);
export const updateSetting = (data: SettingBody) => clientSystemApi.post(API_UPDATE_SETTING, data);
export const changePassword = (data: ChangePasswordBody) =>
  clientSystemApi.post(API_CHANGE_PASSWORD, data);

export const createRole = (data: CreateRoleBody) => clientSystemApi.post(API_ADD_NEW_ROLE, data);
export const createRight = (data: CreateRightBody) => clientSystemApi.post(API_CREATE_RIGHT, data);
export const createField = (data: CreateFieldBody) => clientSystemApi.post(API_CREATE_FIELD, data);
export const createDataType = (data: CreateDataTypeBody) =>
  clientSystemApi.post(API_CREATE_DATA_TYPE, data);

export const createPosition = (data: CreatePositionBody) =>
  clientSystemApi.post(API_CREATE_POSITION, data);

export const addRoleToUser = (data: AddRoleToUserBody) =>
  clientSystemApi.post(API_ADD_ROLE_TO_USER, data);

export const addRightToRole = (data: AddRightToRoleBody) =>
  clientSystemApi.post(API_ADD_RIGHT_TO_ROLE, data);

export const addMenuToRole = (data: AddMenuToRoleBody) =>
  clientSystemApi.post(API_ADD_MENU_TO_ROLE, data);

export interface DetailRoleResType {
  role: Role;
  menuInRole: MenuInRole[];
  rightInRole: RightInRole[];
  userInRole: UserInRole[];
}

export interface Role {
  createdDate: any;
  updatedDate: string;
  createdBy: any;
  updatedBy: string;
  roleId: string;
  roleName: string;
  appId: string;
  parentId: any;
}

export interface RightInRole {
  rightId: string;
  rightName: string;
}

export interface MenuInRole {
  id: string;
  name: string;
}

export interface UserInRole {
  userId: string;
  name: string;
  stt: number;
}

export const detailRole = (id: string): WrapperResponse<DetailRoleResType> =>
  clientSystemApi.get(API_GET_ROLE, {
    params: {
      roleId: id,
    },
  });

export const fetchProfile = (): WrapperResponse<ProfileResType> =>
  clientSystemApi.get(API_GET_PROFILE);

export const insertUserFromExcel = (data: FormData) =>
  clientSystemApi.post(API_INSERT_FROM_EXCEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const insertUnitsFromExcel = (data: FormData) =>
  clientSystemApi.post(API_UNITS_FROM_EXCEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const insertAdministrativeFromExcel = (data: FormData) =>
  clientSystemApi.post(API_ADMINISTRATIVE_FROM_EXCEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
