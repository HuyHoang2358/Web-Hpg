import { createRouter, createWebHistory } from 'vue-router';
import { ADMIN_PAGE_PATH, LOGIN_PAGE_PATH, HOME_PAGE_PATH } from '@/utils/routePath';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashBoard from '@/views/admin/DashBoard.vue';
import UsersView from '@/views/admin/UsersView.vue';
import RightView from '@/views/admin/RightView.vue';
import UnitView from '@/views/admin/UnitView.vue';
import RoleView from '@/views/admin/RoleView.vue';
import PositionsView from '@/views/admin/PositionsView.vue';
import LogsView from '@/views/admin/LogsView.vue';
import MenusView from '@/views/admin/MenusView.vue';
import FieldsView from '@/views/admin/FieldsView.vue';
import DataTypesView from '@/views/admin/DataTypesView.vue';
import AdministrativeView from '@/views/admin/AdministrativeView.vue';
import UpdateAccount from '@/views/admin/UpdateAccount.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: HOME_PAGE_PATH,
      name: 'home',
      component: HomeView,
    },
    {
      path: LOGIN_PAGE_PATH,
      name: 'about',
      component: LoginView,
    },
    {
      path: ADMIN_PAGE_PATH,
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'user',
          component: UsersView,
        },
        {
          path: 'menu',
          component: MenusView,
        },
        {
          path: 'right',
          component: RightView,
        },
        {
          path: 'role',
          component: RoleView,
        },
        {
          path: 'position',
          component: PositionsView,
        },
        {
          path: 'unit',
          component: UnitView,
        },
        {
          path: 'log',
          component: LogsView,
        },
        {
          path: 'data-type',
          component: DataTypesView,
        },
        {
          path: 'field',
          component: FieldsView,
        },
        {
          path: 'administrative',
          component: AdministrativeView,
        },
        {
          path: 'profile',
          component: UpdateAccount,
        },
      ],
    },
  ],
});

export default router;
