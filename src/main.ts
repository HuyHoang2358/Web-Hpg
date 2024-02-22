import './assets/main.css';
import './assets/base.css';
import './assets/custom-antdv.css';
import 'ant-design-vue/dist/reset.css';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import { i18n } from '@/utils/i18n';

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
