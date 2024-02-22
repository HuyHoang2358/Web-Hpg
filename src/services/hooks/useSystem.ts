import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  addMenuToRole,
  addRightToRole,
  addRoleToUser,
  changePassword,
  changePasswordByAdmin,
  createAdministrative,
  createDataType,
  createField,
  createMenu,
  createPosition,
  createRight,
  createRole,
  createUnit,
  createUser,
  deleteAdministrative,
  deleteDataType,
  deleteField,
  deleteMenu,
  deletePosition,
  deleteRight,
  deleteRole,
  deleteUnit,
  deleteUser,
  deleteUserUnit,
  detailRole,
  downloadUserList,
  editAdministrative,
  editMenu,
  editPosition,
  editRole,
  editUnit,
  fetchAdministrative,
  fetchApps,
  fetchDataTypes,
  fetchFields,
  fetchLogs,
  fetchMenus,
  fetchNotifications,
  fetchPositions,
  fetchProfile,
  fetchRights,
  fetchRoles,
  fetchUnits,
  fetchUsers,
  fetchUsersInUnit,
  insertAdministrativeFromExcel,
  insertUnitsFromExcel,
  insertUserFromExcel,
  updateDataType,
  updateField,
  updateRight,
  updateSetting,
  updateUser,
} from '@/services/apis/systemApi';
import type { BaseRefParams } from '@/services/apis/systemApi';
import type { ComputedRef, Ref } from 'vue';

export const SYS_APPS_QUERY_KEY = 'SYS_APPS_QUERY_KEY';
export const MENUS_QUERY_KEY = 'MENUS_QUERY_KEY';
export const SYS_RIGHTS_QUERY_KEY = 'SYS_RIGHTS_QUERY_KEY';
export const SYS_FIELDS_QUERY_KEY = 'SYS_FIELDS_QUERY_KEY';
export const DATA_TYPES_QUERY_KEY = 'DATA_TYPES_QUERY_KEY';
export const ADMINISTRATIVE_QUERY_KEY = 'ADMINISTRATIVE_QUERY_KEY';
export const SYS_UNITS_QUERY_KEY = 'SYS_UNITS_QUERY_KEY';
export const USERS_IN_UNIT_QUERY_KEY = 'USERS_IN_UNIT_QUERY_KEY';
export const POSITIONS_QUERY_KEY = 'POSITIONS_QUERY_KEY';
export const USERS_QUERY_KEY = 'USERS_QUERY_KEY';
export const ROLE_QUERY_KEY = 'ROLE_QUERY_KEY';
export const NOTIFICATIONS_QUERY_KEY = 'NOTIFICATIONS_QUERY_KEY';
export const LOGS_QUERY_KEY = 'LOGS_QUERY_KEY';
export const PROFILE_QUERY_KEY = 'PROFILE_QUERY_KEY';

export const useSysApp = () =>
  useQuery({
    queryKey: [SYS_APPS_QUERY_KEY],
    queryFn: fetchApps,
    retry: 2,
  });

export const useProfile = (enabled?: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: fetchProfile,
    retry: 2,
    enabled,
  });

export const useMutationProfile = () => useMutation({ mutationFn: fetchProfile });

export const useMenus = () =>
  useQuery({
    queryKey: [MENUS_QUERY_KEY],
    queryFn: fetchMenus,
    retry: 2,
  });

export const useSysRight = () =>
  useQuery({
    queryKey: [SYS_RIGHTS_QUERY_KEY],
    queryFn: fetchRights,
    retry: 2,
  });

export const useFields = (params?: BaseRefParams) =>
  useQuery({
    queryKey: [SYS_FIELDS_QUERY_KEY, params],
    queryFn: () =>
      fetchFields({
        searchValue: params?.searchValue?.value || undefined,
        direction: params?.direction?.value || undefined,
        sort: params?.sort?.value || undefined,
      }),
    retry: 2,
  });

export const useDataTypes = (params?: BaseRefParams) =>
  useQuery({
    queryKey: [DATA_TYPES_QUERY_KEY, params],
    queryFn: () =>
      fetchDataTypes({
        searchValue: params?.searchValue?.value || undefined,
        direction: params?.direction?.value || undefined,
        sort: params?.sort?.value || undefined,
      }),
    retry: 2,
  });

export const useAdministrative = (params?: BaseRefParams) =>
  useQuery({
    queryKey: [ADMINISTRATIVE_QUERY_KEY, params],
    queryFn: () =>
      fetchAdministrative({
        searchValue: params?.searchValue?.value || '',
        direction: params?.direction?.value || undefined,
        sort: params?.sort?.value || undefined,
      }),
    retry: 2,
  });

export const useSysUnit = () =>
  useQuery({
    queryKey: [SYS_UNITS_QUERY_KEY],
    queryFn: fetchUnits,
    retry: 2,
  });

export const useUsersInUnit = (
  params: { unitIds?: Ref<string[]>; positions: Ref<string[] | undefined> } & BaseRefParams,
) =>
  useQuery({
    queryKey: [USERS_IN_UNIT_QUERY_KEY, params],
    queryFn: () =>
      fetchUsersInUnit({
        unitIds: params?.unitIds?.value?.join(',') || '',
        page: params?.currentPage?.value ? (params.currentPage.value - 1)?.toString() : '0',
        size: params?.pageSize?.value?.toString() || '10',
        searchValue: params?.searchValue?.value,
        positions: params?.positions.value?.join(',') || undefined,
        sort: params?.sort?.value,
        direction: params?.direction?.value,
      }),
    retry: 2,
  });

export const usePositions = (params?: { searchValue: Ref<string> }) =>
  useQuery({
    queryKey: [POSITIONS_QUERY_KEY, params],
    queryFn: () => fetchPositions({ searchValue: params?.searchValue.value || '' }),
    retry: 2,
  });

export const useAddNewUnit = () => useMutation({ mutationFn: createUnit });
export const useAddNewAdministrative = () => useMutation({ mutationFn: createAdministrative });
export const useEditUnit = () => useMutation({ mutationFn: editUnit });
export const useEditAdministrative = () => useMutation({ mutationFn: editAdministrative });
export const useAddNewMenu = () => useMutation({ mutationFn: createMenu });
export const useEditMenu = () => useMutation({ mutationFn: editMenu });
export const useEditRole = () => useMutation({ mutationFn: editRole });
export const useUpdateRight = () => useMutation({ mutationFn: updateRight });
export const useUpdateField = () => useMutation({ mutationFn: updateField });
export const useUpdateDataType = () => useMutation({ mutationFn: updateDataType });
export const useEditPosition = () => useMutation({ mutationFn: editPosition });

export const useDeleteMenu = () => useMutation({ mutationFn: deleteMenu });
export const useDeleteRole = () => useMutation({ mutationFn: deleteRole });
export const useDeleteRight = () => useMutation({ mutationFn: deleteRight });
export const useDeleteField = () => useMutation({ mutationFn: deleteField });
export const useDeleteDataType = () => useMutation({ mutationFn: deleteDataType });
export const useDeleteAdministrative = () => useMutation({ mutationFn: deleteAdministrative });
export const useDeletePosition = () => useMutation({ mutationFn: deletePosition });
export const useDeleteUnit = () => useMutation({ mutationFn: deleteUnit });
export const useDeleteUserInUnit = () => useMutation({ mutationFn: deleteUserUnit });
export const useDeleteUser = () => useMutation({ mutationFn: deleteUser });
export const useChangePasswordByAdmin = () => useMutation({ mutationFn: changePasswordByAdmin });
export const useDownloadUserList = () => useMutation({ mutationFn: downloadUserList });
export const useInsertUserFromExcel = () => useMutation({ mutationFn: insertUserFromExcel });
export const useInsertUnitFromExcel = () => useMutation({ mutationFn: insertUnitsFromExcel });
export const useInsertAdministrativeFromExcel = () =>
  useMutation({ mutationFn: insertAdministrativeFromExcel });

export const useUsers = (
  params: {
    units: Ref<string[] | undefined>;
    positions: Ref<string[] | undefined>;
    roles: Ref<string[] | undefined>;
    address: Ref<string[] | undefined>;
  } & BaseRefParams,
) =>
  useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () =>
      fetchUsers({
        page: params?.currentPage?.value ? (params.currentPage.value - 1)?.toString() : '0',
        size: params?.pageSize?.value || '10',
        searchValue: params?.searchValue?.value,
        units: params?.units.value?.join(','),
        positions: params?.positions.value?.join(','),
        sort: params?.sort?.value,
        direction: params?.direction?.value,
        roles: params?.roles?.value?.join(','),
        address: params?.address?.value?.join(','),
      }),
    retry: 2,
  });

export const useRoles = () =>
  useQuery({
    queryKey: [ROLE_QUERY_KEY],
    queryFn: fetchRoles,
    retry: 2,
  });

export const useLogs = (params: {
  searchValue: Ref<string>;
  sort: Ref<string>;
  direction: Ref<string>;
  userIds: Ref<string[] | undefined>;
}) =>
  useQuery({
    queryKey: [LOGS_QUERY_KEY, params],
    queryFn: () =>
      fetchLogs({
        searchValue: params?.searchValue.value,
        userIds: params?.userIds.value?.join(','),
        sort: params?.sort.value,
        direction: params?.direction.value,
      }),
    retry: 2,
  });
export const useAddNewUser = () => useMutation({ mutationFn: createUser });
export const useUpdateUser = () => useMutation({ mutationFn: updateUser });
export const useUpdateSetting = () => useMutation({ mutationFn: updateSetting });
export const useChangePassword = () => useMutation({ mutationFn: changePassword });

export const useCreateRole = () => useMutation({ mutationFn: createRole });
export const useCreateRight = () => useMutation({ mutationFn: createRight });
export const useCreateField = () => useMutation({ mutationFn: createField });
export const useCreateDataType = () => useMutation({ mutationFn: createDataType });
export const useCreatePosition = () => useMutation({ mutationFn: createPosition });
export const useAddRoleToPeople = () => useMutation({ mutationFn: addRoleToUser });
export const useFetchDetailRole = () => useMutation({ mutationFn: detailRole });
export const useAddRightToRole = () => useMutation({ mutationFn: addRightToRole });
export const useAddMenuToRole = () => useMutation({ mutationFn: addMenuToRole });

export const useNotifications = () =>
  useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY],
    queryFn: fetchNotifications,
    retry: 2,
  });
