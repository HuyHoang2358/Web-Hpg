import { beforeAll, describe, expect, it } from 'vitest';
import MenusAdmin from '../../../views/admin/MenusAdmin.vue';
import { mountComponent } from '@/components/__tests__/common';
import { VueWrapper } from '@vue/test-utils';
import { MENU_KEY } from '@/utils/enums';

describe('MenusAdmin', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = mountComponent(MenusAdmin);
  });

  it('renders properly', () => {
    expect(wrapper.text()).toContain('Quản trị hệ thống');
  });

  it('click menu item', () => {
    const buttonUser = wrapper.find(`#${MENU_KEY.USER}`);
    expect(buttonUser.isVisible());
    buttonUser.trigger('click');
  });
});
