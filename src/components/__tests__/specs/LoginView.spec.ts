import { describe, it, expect, beforeAll } from 'vitest';
import { VueWrapper } from '@vue/test-utils';
import LoginView from '@/views/LoginView.vue';
import { mockRejectedValue, mockResolvedValue, mountComponent } from '../common';
import { mockLoginApiError, mockLoginApiSuccess } from '../mockApi/loginApi.mock';

describe('LoginView', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = mountComponent(LoginView);
  });

  it('renders properly', () => {
    expect(wrapper.text()).toContain('Đăng nhập');
  });

  it('submits the form on button click with success response', async () => {
    await wrapper.get('[data-test="username"]').setValue('test-username');
    await wrapper.get('[data-test="password"]').setValue('test-password');
    await wrapper.get('[data-test="form"]').trigger('submit');

    await mockResolvedValue({ data: mockLoginApiSuccess });
  });

  it('submits the form on button click with fail response', async () => {
    await wrapper.get('[data-test="username"]').setValue('test-username');
    await wrapper.get('[data-test="password"]').setValue('test-password');
    await wrapper.get('[data-test="form"]').trigger('submit');

    await mockRejectedValue({ data: mockLoginApiError });
  });

  it('displays a warning modal on "Quên mật khẩu?" click', async () => {
    // Simulate click on the "Quên mật khẩu ?" link
    await wrapper.get('#forgot-password').trigger('click');
  });
});
