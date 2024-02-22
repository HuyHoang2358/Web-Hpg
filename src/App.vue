<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<script lang="ts">
// import dayjs from 'dayjs';
// import 'dayjs/locale/vi';
import { notification } from 'ant-design-vue';
// dayjs.locale('vi');

notification.config({
  placement: 'topRight',
  rtl: true,
});
</script>
