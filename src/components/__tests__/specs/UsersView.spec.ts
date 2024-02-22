import { describe, it, expect, beforeAll } from 'vitest';
import { flushPromises, VueWrapper } from '@vue/test-utils';
import {
  makingHttpRequest,
  makingHttpRequests,
  mountComponent,
  querySelector,
  renderedNames,
} from '../common';
import UsersView from '@/views/admin/UsersView.vue';
import {
  API_CHANGE_PASSWORD_BY_ADMIN,
  API_DELETE_USER,
  API_DOWNLOAD_USER_LIST,
  API_GET_ROLES,
  API_GET_USERS,
  SYS_API_GET_ADMINISTRATIVE,
  SYS_API_GET_POSITIONS,
  SYS_API_GET_UNITS,
} from '@/utils/apiPath';
import {
  mockApiDownloadUserListSuccess,
  mockApiGetAdministrativeSuccess,
  mockApiGetPositionSuccess,
  mockApiGetRolesSuccess,
  mockApiGetUnitsSuccess,
  mockApiGetUsersSuccess,
  mockApiMutationFailed,
  mockApiMutationSuccess,
  mockApiSearchUsersSuccess,
} from '@/components/__tests__/mockApi/systemApi.mock';

describe('LoginView', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    makingHttpRequests([
      {
        endPoint: API_GET_ROLES,
        method: 'get',
        statusOrCallback: 200,
        data: mockApiGetRolesSuccess,
      },
      {
        endPoint: API_GET_USERS,
        method: 'get',
        statusOrCallback: 200,
        data: mockApiGetUsersSuccess,
      },
      {
        endPoint: SYS_API_GET_ADMINISTRATIVE,
        method: 'get',
        statusOrCallback: 200,
        data: mockApiGetAdministrativeSuccess,
      },
      {
        endPoint: SYS_API_GET_UNITS,
        method: 'get',
        statusOrCallback: 200,
        data: mockApiGetUnitsSuccess,
      },
      {
        endPoint: SYS_API_GET_POSITIONS,
        method: 'get',
        statusOrCallback: 200,
        data: mockApiGetPositionSuccess,
      },
    ]);
    wrapper = mountComponent(UsersView);
  });

  it('renders properly', async () => {
    expect(wrapper.text()).toContain('Danh sách người dùng');
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual([
      'User 1',
      'User 2',
      'User 3',
      'User 4',
      'User 5',
      'User 6',
      'User 7',
      'User 8',
      'User 9',
      'User 10',
    ]);
  });

  it('should be able search user', async () => {
    makingHttpRequest({
      endPoint: API_GET_USERS,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiSearchUsersSuccess,
    });
    await wrapper.get('[data-test="search-input"]').setValue('User 1');
    await flushPromises();
    const renderedNamesResult = renderedNames(wrapper);
    expect(renderedNamesResult).toEqual(['User 1']);
  });

  it('should be able to download the user list as an Excel file', async () => {
    const buttonExport = wrapper.get('#export-excel');
    expect(buttonExport.isVisible());
    makingHttpRequest({
      endPoint: API_DOWNLOAD_USER_LIST,
      method: 'get',
      statusOrCallback: 200,
      data: mockApiDownloadUserListSuccess,
    });
    await buttonExport.trigger('click');
  });

  const deleteUser = async () => {
    await wrapper.get('[data-test="more-outline-0"]').trigger('click');
    await wrapper.vm.$nextTick();
    const deleteUserButton = querySelector('#delete-user');
    deleteUserButton?.click();
    const okButton = querySelector('.ant-modal-confirm-btns .ant-btn-primary');
    okButton?.click();
    const modalElement = querySelector('.ant-modal-root');
    modalElement.remove();
  };

  const resetPasswordUser = async () => {
    await wrapper.get('[data-test="more-outline-0"]').trigger('click');
    await wrapper.vm.$nextTick();
    const resetPasswordButton = querySelector('#reset-password');
    resetPasswordButton?.click();
    const okButton = querySelector('.ant-modal-confirm-btns .ant-btn-primary');
    okButton?.click();
    const modalElement = querySelector('.ant-modal-root');
    modalElement.remove();
  };

  it('should be able to delete a user', async () => {
    makingHttpRequest({
      endPoint: API_DELETE_USER,
      method: 'post',
      statusOrCallback: 200,
      data: mockApiMutationSuccess,
    });
    await deleteUser();
  });

  it('delete a user failed', async () => {
    makingHttpRequest({
      endPoint: API_DELETE_USER,
      method: 'post',
      statusOrCallback: 400,
      data: mockApiMutationFailed,
    });
    await deleteUser();
  });

  it('should be able to reset password user', async () => {
    makingHttpRequest({
      endPoint: API_CHANGE_PASSWORD_BY_ADMIN,
      method: 'post',
      statusOrCallback: 200,
      data: mockApiMutationSuccess,
    });
    await resetPasswordUser();
  });

  it('reset password user failed', async () => {
    makingHttpRequest({
      endPoint: API_CHANGE_PASSWORD_BY_ADMIN,
      method: 'post',
      statusOrCallback: 400,
      data: mockApiMutationFailed,
    });
    await resetPasswordUser();
  });

  it('', () => {});
});
