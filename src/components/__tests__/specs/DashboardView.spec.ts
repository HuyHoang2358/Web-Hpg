import { describe, test } from 'vitest';
import DashBoard from '../../../views/admin/DashBoard.vue';
import { mockResolvedValue, shallowMountComponent } from '../common';
import { mockApiProfileSuccess } from '../mockApi/systemApi.mock';

describe('DashboardView', () => {
  test('renders properly', () => {
    mockResolvedValue({ data: mockApiProfileSuccess });
    shallowMountComponent(DashBoard);
  });
});
